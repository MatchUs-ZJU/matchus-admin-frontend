import {request} from "@@/plugin-request/request";
import {BASE_URL} from "@/services/utils";
import {FacultyItem} from "@/pages/data";

export async function getFacultyList(
  options?: { [key: string]: any
  }) {
  return request<API.ResponseData<FacultyItem[]>>(`${BASE_URL}/user/faculty`, {
    method: 'GET',
    ...(options || {}),
  });
}

