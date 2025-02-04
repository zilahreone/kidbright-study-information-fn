import Keycloak from 'keycloak-js'

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloakConfig = {
  url: process.env.KEYCLOAK_URL || '',
  realm: process.env.KEYCLOAK_REALM || '',
  clientId: process.env.KEYCLOAK_CLIENTID || '',
}

const keycloak = new Keycloak(keycloakConfig)

export default keycloak