import { Model } from "mongoose";
import { Request } from "express";

import { Response } from "express";
type DynamicContent =
  | string
  | Record<string, unknown>
  | null
  | undefined
  | Array<string>
  | number;

const sendSuccessResponse = function (
  res: Response,
  content: Array<String>,
  message: string,
  status?: number
) {
  const data = {
    success: true,
    message,
    data: content,
  };

  res.status(!status ? 200 : status).json(data);
};




const sendErrorResponse = function (
  res: Response,
  content: DynamicContent,
  message: string | Error | undefined | null,
  status?: number
) {
  const data = {
    message: message,
    errors: content,
  };

  res.status(!status ? 400 : status).json(data);
};


const errorResponse = function (
  res: Response,
  errors: DynamicContent,
  message: string | Error | undefined | null,
  status?: number
) {
  const data = {
    message: message,
    errors: errors,
  };

  res.status(!status ? 400 : status).json(data);
};

const trimCollection = (
  data: Record<string, unknown>
): Record<string, unknown> => {
  const newData = { ...data };

  Object.keys(data).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (typeof value === "string") {
        newData[key] = value.trim();
      }
    }
  });

  return newData;
};

export interface ValidParamsResult {
  success: boolean;
  message: Array<string>;
}
export interface ValidParam {
  name: string;
  type: string;
}

const validParam = (
  obj: Record<string, unknown>,
  requiredParam: Array<ValidParam>
): ValidParamsResult => {
  const objKeys = Object.keys(obj);
  const notFound: Array<string> = [];
  let success = true;

  requiredParam.forEach((param) => {
    const idx = objKeys.findIndex((k) => {
      return k === param.name;
    });

    if (idx < 0) {
      notFound.push(`${param.name} is required`);
      success = false;
    } else if (
      param.type &&
      typeof obj[param.name] !== param.type &&
      param.type !== "array"
    ) {
      notFound.push(`${param.name} should be ${param.type}`);
      success = false;
    }
    // array type validation
    else if (param.type === "array" && !Array.isArray(obj[param.name])) {
      notFound.push(`${param.name} should be ${param.type}`);
      success = false;
    }
  });

  return {
    success,
    message: notFound,
  };
};


export default {
  
  sendSuccessResponse,
  sendErrorResponse,
  errorResponse,
  trimCollection,
  validParam,
};
