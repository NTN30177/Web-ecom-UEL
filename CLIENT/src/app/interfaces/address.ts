
interface ILocationBase {
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
  code: string;
}

export interface IProvinceDocument extends ILocationBase, Document {}

export interface IDistrictDocument extends ILocationBase, Document {
  path: string;
  path_with_type: string;
  parent_code: string;
}

export interface IWardDocument extends ILocationBase, Document {
  path: string;
  path_with_type: string;
  parent_code: string;
}

