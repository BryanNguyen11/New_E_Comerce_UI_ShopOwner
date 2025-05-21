
import Keycloak from 'keycloak-js'

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://5eac-125-235-239-196.ngrok-free.app',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'demo',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'frontend-client'
}

const keycloak = new Keycloak(keycloakConfig)


export default keycloak
