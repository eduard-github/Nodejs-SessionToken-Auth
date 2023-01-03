import { CredentialDBAccess } from "../src/Authorization/CredentialsDBAccess";

class DBTest {
  public credentilDBAccess: CredentialDBAccess = new CredentialDBAccess()
}

new DBTest().credentilDBAccess.putCredential({
  username: 'User1',
  password: '123456',
  rights: [0,1,2,3]
})

