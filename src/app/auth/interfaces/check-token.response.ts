import { DatosUsuario } from "./user.interface";

export interface CheckTokenResponse {
  usuario: DatosUsuario;
  token: string;
}
