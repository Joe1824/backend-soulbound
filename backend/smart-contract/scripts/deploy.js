async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Soulbound = await ethers.getContractFactory("SoulboundNFT");
  const sb = await Soulbound.deploy("NIE Identity", "NIEID");
  await sb.waitForDeployment();
  console.log("SoulboundNFT deployed to:", await sb.getAddress());
}
main()
  .then(()=>process.exit(0))
  .catch(err => { console.error(err); process.exit(1) });
