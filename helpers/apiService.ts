import instance from "@/api/instance";

// Generic GET function with type support
const GETCALL = async <T>(
  url: string,
  params?: Record<string, any>
): Promise<T> => {
  try {
    // Validate URL
    if (!url || typeof url !== "string" || url.trim() === "") {
      throw new Error("Invalid or missing URL");
    }

    // Handle query parameters safely
    const queryString = params
      ? `?${new URLSearchParams(
          Object.entries(params).filter(
            ([_, value]) => value !== undefined && value !== null
          )
        ).toString()}`
      : "";

    const response = await instance.get<T>(`${url}${queryString}`);
    return response.data;
  } catch (error: any) {
    // Re-throw the error to be handled by the caller
    throw error;
  }
};

export { GETCALL };
