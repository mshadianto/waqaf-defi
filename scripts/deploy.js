const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "POL");

  // Deploy WaqfToken
  const WaqfToken = await hre.ethers.getContractFactory("WaqfToken");
  const token = await WaqfToken.deploy();
  await token.waitForDeployment();
  const addr = await token.getAddress();
  console.log("WaqfToken deployed to:", addr);

  // ── Seed demo data ──
  console.log("\n── Seeding demo data ──");

  // KYC the deployer
  let tx = await token.setKYCStatus(deployer.address, true);
  await tx.wait();
  console.log("✓ KYC verified:", deployer.address);

  // Create 4 projects (one per pillar)
  const projects = [
    ["Masjid Al-Ikhlas Jakarta",  0], // AsetTetap
    ["Sukuk Wakaf BSI Series A",  1], // WakafUang
    ["RS Wakaf Surabaya",         2], // MelaluiUang
    ["Kebun Produktif Cianjur",   3], // UsahaProduktif
  ];

  for (const [name, pillar] of projects) {
    tx = await token.createProject(name, pillar, deployer.address);
    await tx.wait();
    console.log(`✓ Project created: ${name} (Pilar ${pillar + 1})`);
  }

  // Mint tokens for each project
  const amounts = [5_000_000, 1_000_000, 2_500_000, 2_000_000];
  for (let i = 0; i < 4; i++) {
    tx = await token.mintWaqfToken(i, amounts[i]);
    await tx.wait();
    const tokens = amounts[i] / 10_000;
    console.log(`✓ Minted ${tokens} WAQF for project ${i} (${projects[i][0]})`);
  }

  // Add beneficiaries (demo addresses)
  const beneficiaryAddrs = [
    "0x1111111111111111111111111111111111111111",
    "0x2222222222222222222222222222222222222222",
    "0x3333333333333333333333333333333333333333",
  ];
  for (const b of beneficiaryAddrs) {
    tx = await token.addBeneficiary(b);
    await tx.wait();
  }
  console.log(`✓ Added ${beneficiaryAddrs.length} beneficiaries`);

  // Summary
  const totalValue = await token.totalWaqfValue();
  const totalSupply = await token.totalSupply();
  const projectCount = await token.projectCount();

  console.log("\n══════════════════════════════════════");
  console.log("  WaqFi Deployment Summary");
  console.log("══════════════════════════════════════");
  console.log("  Contract:      ", addr);
  console.log("  Network:        Polygon Amoy Testnet");
  console.log("  Chain ID:       80002");
  console.log("  Projects:      ", projectCount.toString());
  console.log("  Total Supply:  ", hre.ethers.formatEther(totalSupply), "WAQF");
  console.log("  Total Value:   ", totalValue.toString(), "units");
  console.log("  Beneficiaries:  3");
  console.log("══════════════════════════════════════");
  console.log(`  Explorer: https://amoy.polygonscan.com/address/${addr}`);
  console.log("══════════════════════════════════════");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
