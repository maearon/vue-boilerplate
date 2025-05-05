import api from "."

export interface Micropost {
  id: number
  content: string
  user_id: number
  user_name: string
  gravatar_id: string
  size: number
  image?: string
  timestamp: string
}

export interface ListResponse<T> {
  feed_items: T[]
  total_count: number
  following: number
  followers: number
  micropost: number
  gravatar: string
}

export interface CreateResponse {
  flash?: [string, string]
  error?: string[]
}

export interface RemoveResponse {
  flash?: [string, string]
}

const micropostApi = {
  getAll(params: { page: number }): Promise<ListResponse<Micropost>> {
    return api.get("/microposts", { params }).then((response) => response)
  },

  create(data: FormData): Promise<CreateResponse> {
    return api.post("/microposts", data).then((response) => response)
  },

  remove(id: number): Promise<RemoveResponse> {
    return api.delete(`/microposts/${id}`).then((response) => response)
  },
}

export default micropostApi
