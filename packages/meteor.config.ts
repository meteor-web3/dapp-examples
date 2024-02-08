export const config = {
  name: "meteor_app_v1", // app name should NOT contain "-"
  logo: "https://avatars.githubusercontent.com/u/118692557?s=200&v=4",
  website: [], // you can use localhost:(port) for testing
  defaultFolderName: "Main",
  description:
    "Meteor is your web3 personal computer where you control your data with a wallet.",
  feeRatio: 0.05,
  models: [
    {
      isPublicDomain: true,
      schemaName: "profile.graphql",
      encryptable: [],
      feeRatio: 0,
    },
  ],
  ceramicUrl: "https://dataverseceramicdaemon.com", // leave null to use dataverse test Ceramic node. Set to {Your Ceramic node Url} for mainnet, should start with "https://".
};
