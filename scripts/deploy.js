const hre = require("hardhat");

async function main() {
  const ExampleYourToken = await hre.ethers.getContractFactory("YourToken");
  const exampleYourToken = await ExampleYourToken.deploy();

  await exampleYourToken.deployed();

  console.log("YourToken deployed to:", exampleYourToken.address);

  const ExampleVendor = await hre.ethers.getContractFactory("Vendor");
  const exampleVendor = await ExampleVendor.deploy(exampleYourToken.address);

  await exampleVendor.deployed();
  console.log("Vendor deployed to:", exampleVendor.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
