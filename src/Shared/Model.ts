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

export enum HTTP_CODES {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404
}

export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE'
}

export interface User {
  id: string,
  name: string,
  age: number,
  email: string,
  position: Position
}

export enum Position {
  JUNIOR,
  PRIGRAMMER,
  ENGINEER,
  EXPERT,
  MANAGER
}

