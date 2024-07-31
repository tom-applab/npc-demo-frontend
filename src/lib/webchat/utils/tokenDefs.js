export const createToken = () => {
  const uriGenerateToken =
    'https://npc-demo-dotnet-hxfvdsbcfmdjfbga.westeurope-01.azurewebsites.net/api/directline'; // Development
    // 'https://qfwebsitebot-staging.azurewebsites.net/api/directline'; // Staging
   //  'https://qfwebsitebot-prod.azurewebsites.net/api/directline'; // Production
  const params = {
    method: 'GET'
  };

  return { uriGenerateToken, params };
};

export const checkTokenExpirationDate = token => {
  if (!token || token === "undefined") return;
  const payload = token.split('.')[1];
  const decodedToken = atob(payload);
  const expDate = JSON.parse(decodedToken).exp * 1000;
  return new Date(expDate) >= new Date();
};
