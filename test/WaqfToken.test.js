const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WaqfToken", function () {
  let token, owner, wakif, beneficiary1, beneficiary2;

  beforeEach(async function () {
    [owner, wakif, beneficiary1, beneficiary2] = await ethers.getSigners();
    const WaqfToken = await ethers.getContractFactory("WaqfToken");
    token = await WaqfToken.deploy();
  });

  describe("Deployment", function () {
    it("Should set correct name and symbol", async function () {
      expect(await token.name()).to.equal("WaqFi Token");
      expect(await token.symbol()).to.equal("WAQF");
    });

    it("Should grant admin roles to deployer", async function () {
      const adminRole = await token.DEFAULT_ADMIN_ROLE();
      expect(await token.hasRole(adminRole, owner.address)).to.be.true;
    });
  });

  describe("KYC", function () {
    it("Should set KYC status", async function () {
      await token.setKYCStatus(wakif.address, true);
      expect(await token.kycVerified(wakif.address)).to.be.true;
    });

    it("Should batch set KYC", async function () {
      await token.batchSetKYC([wakif.address, beneficiary1.address], true);
      expect(await token.kycVerified(wakif.address)).to.be.true;
      expect(await token.kycVerified(beneficiary1.address)).to.be.true;
    });

    it("Should reject non-admin KYC changes", async function () {
      await expect(
        token.connect(wakif).setKYCStatus(wakif.address, true)
      ).to.be.reverted;
    });
  });

  describe("Project Management", function () {
    it("Should create a project", async function () {
      await token.createProject("Masjid Wakaf", 0, owner.address);
      const project = await token.getProject(0);
      expect(project.name).to.equal("Masjid Wakaf");
      expect(project.active).to.be.true;
      expect(await token.projectCount()).to.equal(1);
    });
  });

  describe("Minting (mintWaqfToken)", function () {
    beforeEach(async function () {
      await token.createProject("Test Project", 0, owner.address);
      await token.setKYCStatus(wakif.address, true);
    });

    it("Should mint tokens for verified wakif", async function () {
      await token.connect(wakif).mintWaqfToken(0, 500_000);
      // 500_000 / 10_000 = 50 WAQF = 50e18
      expect(await token.balanceOf(wakif.address)).to.equal(ethers.parseEther("50"));
    });

    it("Should emit WakafContributed event", async function () {
      await expect(token.connect(wakif).mintWaqfToken(0, 100_000))
        .to.emit(token, "WakafContributed")
        .withArgs(wakif.address, 0, 100_000, ethers.parseEther("10"));
    });

    it("Should update project totals", async function () {
      await token.connect(wakif).mintWaqfToken(0, 1_000_000);
      const project = await token.getProject(0);
      expect(project.totalRaised).to.equal(1_000_000);
    });

    it("Should reject non-KYC user", async function () {
      await expect(
        token.connect(beneficiary1).mintWaqfToken(0, 100_000)
      ).to.be.revertedWith("KYC not verified");
    });

    it("Should reject below minimum", async function () {
      await expect(
        token.connect(wakif).mintWaqfToken(0, 5_000)
      ).to.be.revertedWith("Min Rp 10.000");
    });

    it("Should record contribution history", async function () {
      await token.connect(wakif).mintWaqfToken(0, 250_000);
      const contribs = await token.getContributions(wakif.address);
      expect(contribs.length).to.equal(1);
      expect(contribs[0].amount).to.equal(250_000);
    });
  });

  describe("ROI Distribution", function () {
    beforeEach(async function () {
      await token.createProject("ROI Test", 1, owner.address);
      await token.addBeneficiary(beneficiary1.address);
      await token.addBeneficiary(beneficiary2.address);
    });

    it("Should distribute ROI equally to beneficiaries", async function () {
      const amount = ethers.parseEther("1.0"); // 1 POL
      const before1 = await ethers.provider.getBalance(beneficiary1.address);

      await token.distributeROI(0, { value: amount });

      const after1 = await ethers.provider.getBalance(beneficiary1.address);
      expect(after1 - before1).to.equal(ethers.parseEther("0.5"));
    });

    it("Should emit ROIDistributed event", async function () {
      const amount = ethers.parseEther("2.0");
      await expect(token.distributeROI(0, { value: amount }))
        .to.emit(token, "ROIDistributed")
        .withArgs(0, amount, 2);
    });

    it("Should track total ROI distributed", async function () {
      await token.distributeROI(0, { value: ethers.parseEther("1.0") });
      expect(await token.totalROIDistributed()).to.equal(ethers.parseEther("1.0"));
    });

    it("Should reject with no beneficiaries", async function () {
      await token.removeBeneficiary(beneficiary1.address);
      await token.removeBeneficiary(beneficiary2.address);
      await expect(
        token.distributeROI(0, { value: ethers.parseEther("1.0") })
      ).to.be.revertedWith("No beneficiaries");
    });
  });

  describe("Beneficiary Management", function () {
    it("Should add and remove beneficiaries", async function () {
      await token.addBeneficiary(beneficiary1.address);
      expect(await token.getBeneficiaryCount()).to.equal(1);

      await token.removeBeneficiary(beneficiary1.address);
      expect(await token.getBeneficiaryCount()).to.equal(0);
    });
  });

  describe("End-to-End Flow", function () {
    it("Wakif → KYC → Mint → Nazhir → ROI → Beneficiary", async function () {
      // 1. Create project
      await token.createProject("E2E Masjid", 0, owner.address);

      // 2. KYC wakif
      await token.setKYCStatus(wakif.address, true);

      // 3. Wakif mints
      await token.connect(wakif).mintWaqfToken(0, 1_000_000);
      expect(await token.balanceOf(wakif.address)).to.equal(ethers.parseEther("100"));

      // 4. Add beneficiary
      await token.addBeneficiary(beneficiary1.address);

      // 5. Nazhir distributes ROI
      const before = await ethers.provider.getBalance(beneficiary1.address);
      await token.distributeROI(0, { value: ethers.parseEther("0.5") });
      const after = await ethers.provider.getBalance(beneficiary1.address);

      // 6. Beneficiary received ROI
      expect(after - before).to.equal(ethers.parseEther("0.5"));

      // 7. Verify on-chain state
      expect(await token.totalWaqfValue()).to.equal(1_000_000);
      expect(await token.totalROIDistributed()).to.equal(ethers.parseEther("0.5"));
    });
  });
});
