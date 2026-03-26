// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title WaqfToken (WAQF)
 * @notice Simplified wakaf tokenization on Polygon — Hackathon DIGDAYA 2026
 * @dev ERC-20 with role-based access, KYC gating, project management,
 *      and on-chain ROI distribution to beneficiaries.
 *
 *  Flow:  Wakif → mintWaqfToken() → holds WAQF tokens
 *         Nazhir → distributeROI() → beneficiaries receive POL
 */
contract WaqfToken is ERC20, AccessControl, ReentrancyGuard {

    // ══════════════════════════════════════════════════════════
    //  Roles
    // ══════════════════════════════════════════════════════════
    bytes32 public constant NAZHIR_ROLE = keccak256("NAZHIR_ROLE");
    bytes32 public constant KYC_ADMIN_ROLE = keccak256("KYC_ADMIN_ROLE");

    // ══════════════════════════════════════════════════════════
    //  Data Structures
    // ══════════════════════════════════════════════════════════
    enum PillarType { AsetTetap, WakafUang, MelaluiUang, UsahaProduktif }

    struct WaqfProject {
        string name;
        PillarType pillar;
        uint256 totalRaised;
        uint256 totalTokensMinted;
        address nazhir;
        bool active;
    }

    struct Contribution {
        uint256 projectId;
        uint256 amount;
        uint256 tokensMinted;
        uint256 timestamp;
    }

    // ══════════════════════════════════════════════════════════
    //  State
    // ══════════════════════════════════════════════════════════
    uint256 public constant MIN_CONTRIBUTION = 10_000; // Rp 10.000 (unit)
    uint256 public constant TOKEN_UNIT = 10_000;       // 1 WAQF = 10.000 unit

    uint256 public projectCount;
    mapping(uint256 => WaqfProject) public projects;
    mapping(address => bool) public kycVerified;
    mapping(address => Contribution[]) public contributions;

    address[] public beneficiaries;
    mapping(address => bool) public isBeneficiary;

    uint256 public totalWaqfValue;
    uint256 public totalROIDistributed;

    // ══════════════════════════════════════════════════════════
    //  Events
    // ══════════════════════════════════════════════════════════
    event ProjectCreated(uint256 indexed projectId, string name, PillarType pillar, address nazhir);
    event KYCStatusChanged(address indexed account, bool status);
    event WakafContributed(address indexed wakif, uint256 indexed projectId, uint256 amount, uint256 tokensMinted);
    event ROIDistributed(uint256 indexed projectId, uint256 totalROI, uint256 beneficiaryCount);
    event BeneficiaryAdded(address indexed beneficiary);
    event BeneficiaryRemoved(address indexed beneficiary);

    // ══════════════════════════════════════════════════════════
    //  Constructor
    // ══════════════════════════════════════════════════════════
    constructor() ERC20("WaqFi Token", "WAQF") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(NAZHIR_ROLE, msg.sender);
        _grantRole(KYC_ADMIN_ROLE, msg.sender);
    }

    // ══════════════════════════════════════════════════════════
    //  KYC Management
    // ══════════════════════════════════════════════════════════
    function setKYCStatus(address account, bool status) external onlyRole(KYC_ADMIN_ROLE) {
        kycVerified[account] = status;
        emit KYCStatusChanged(account, status);
    }

    function batchSetKYC(address[] calldata accounts, bool status) external onlyRole(KYC_ADMIN_ROLE) {
        for (uint256 i = 0; i < accounts.length; i++) {
            kycVerified[accounts[i]] = status;
            emit KYCStatusChanged(accounts[i], status);
        }
    }

    // ══════════════════════════════════════════════════════════
    //  Project Management
    // ══════════════════════════════════════════════════════════
    function createProject(
        string calldata name,
        PillarType pillar,
        address nazhir
    ) external onlyRole(NAZHIR_ROLE) returns (uint256) {
        uint256 id = projectCount++;
        projects[id] = WaqfProject({
            name: name,
            pillar: pillar,
            totalRaised: 0,
            totalTokensMinted: 0,
            nazhir: nazhir,
            active: true
        });
        emit ProjectCreated(id, name, pillar, nazhir);
        return id;
    }

    function setProjectActive(uint256 projectId, bool active) external onlyRole(NAZHIR_ROLE) {
        require(projectId < projectCount, "Invalid project");
        projects[projectId].active = active;
    }

    // ══════════════════════════════════════════════════════════
    //  Core: Mint Wakaf Token
    // ══════════════════════════════════════════════════════════
    /**
     * @notice Wakif mints WAQF tokens by contributing to a project.
     * @param projectId  The project to contribute to
     * @param amount     Contribution amount in base units (1 unit = Rp 1)
     */
    function mintWaqfToken(uint256 projectId, uint256 amount) external nonReentrant {
        require(kycVerified[msg.sender], "KYC not verified");
        require(amount >= MIN_CONTRIBUTION, "Min Rp 10.000");
        require(projectId < projectCount, "Invalid project");
        require(projects[projectId].active, "Project inactive");

        uint256 tokens = (amount / TOKEN_UNIT) * 1e18; // 1 WAQF = 1e18
        require(tokens > 0, "Amount too small");

        projects[projectId].totalRaised += amount;
        projects[projectId].totalTokensMinted += tokens;
        totalWaqfValue += amount;

        contributions[msg.sender].push(Contribution({
            projectId: projectId,
            amount: amount,
            tokensMinted: tokens,
            timestamp: block.timestamp
        }));

        _mint(msg.sender, tokens);

        emit WakafContributed(msg.sender, projectId, amount, tokens);
    }

    // ══════════════════════════════════════════════════════════
    //  Core: Distribute ROI to Beneficiaries
    // ══════════════════════════════════════════════════════════
    /**
     * @notice Nazhir distributes ROI (native POL) equally to all beneficiaries.
     * @param projectId The project this ROI belongs to
     */
    function distributeROI(uint256 projectId) external payable onlyRole(NAZHIR_ROLE) nonReentrant {
        require(msg.value > 0, "No ROI to distribute");
        require(projectId < projectCount, "Invalid project");
        require(beneficiaries.length > 0, "No beneficiaries");

        uint256 share = msg.value / beneficiaries.length;
        require(share > 0, "Share too small");

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            (bool sent, ) = beneficiaries[i].call{value: share}("");
            require(sent, "Transfer failed");
        }

        totalROIDistributed += msg.value;
        emit ROIDistributed(projectId, msg.value, beneficiaries.length);
    }

    // ══════════════════════════════════════════════════════════
    //  Beneficiary Management
    // ══════════════════════════════════════════════════════════
    function addBeneficiary(address account) external onlyRole(NAZHIR_ROLE) {
        require(!isBeneficiary[account], "Already beneficiary");
        beneficiaries.push(account);
        isBeneficiary[account] = true;
        emit BeneficiaryAdded(account);
    }

    function removeBeneficiary(address account) external onlyRole(NAZHIR_ROLE) {
        require(isBeneficiary[account], "Not beneficiary");
        isBeneficiary[account] = false;
        // Swap-and-pop
        for (uint256 i = 0; i < beneficiaries.length; i++) {
            if (beneficiaries[i] == account) {
                beneficiaries[i] = beneficiaries[beneficiaries.length - 1];
                beneficiaries.pop();
                break;
            }
        }
        emit BeneficiaryRemoved(account);
    }

    // ══════════════════════════════════════════════════════════
    //  View Functions
    // ══════════════════════════════════════════════════════════
    function getBeneficiaryCount() external view returns (uint256) {
        return beneficiaries.length;
    }

    function getContributions(address wakif) external view returns (Contribution[] memory) {
        return contributions[wakif];
    }

    function getProject(uint256 id) external view returns (WaqfProject memory) {
        require(id < projectCount, "Invalid project");
        return projects[id];
    }
}
