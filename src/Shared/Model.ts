import { Account } from '../Server/Model'

export enum AccessRight {
  CREATE,
  READ,
  UPDATE,
  DELETE
}

export interface Credentials extends Account {
  rights: AccessRight[]
}
