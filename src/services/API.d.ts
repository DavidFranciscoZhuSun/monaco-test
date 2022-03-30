declare namespace API {
  export interface Response<T> {
    code: number;
    msg?: string;
    data?: T;
  }

  export type RegressionCodeItems = {
    regressionUuid: string;
    oldCode?: string;
    newCode?: string;
  };

  export interface RegressionCodeParams {
    userToken: string;
    regression_uuid: string;
    filename: string;
    new_path: string;
    old_path: string;
    revision_flag: string;
  }
}
