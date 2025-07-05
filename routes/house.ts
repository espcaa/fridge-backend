import { Elysia } from "elysia";
import { supabasePlugin } from "../plugins/supabase";

export const houseRoutes = new Elysia({ prefix: "/house" })
  .use(supabasePlugin)
  .post("/createHouse", async ({ body, supabase }) => {
    const { name, description, token } = body as {
      name: string;
      description: string;
      token: string;
    };

    let userId = "";

    // Check the user exists
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return {
          success: false,
          message: "Invalid token or user not found",
          error: error ? error.message : "User not found",
        };
      } else {
        userId = data.user.id;
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to verify user",
        error: (error as Error).message,
      };
    }

    // Add the house to the database

    const { data, error } = await supabase.from("houses").insert({
      name,
      description,
      created_by: userId,
      approved: false,
    });

    if (error) {
      return {
        success: false,
        message: "Failed to create house",
        error: error.message,
      };
    }

    return {
      message: `House '${name}' created with description: ${description}`,
      success: true,
      data,
    };
  })
  .post("/joinHouse", async ({ body, supabase }) => {
    const { houseId, token } = body as {
      houseId: string;
      token: string;
    };

    let userId = "";

    // Check the user exists
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return {
          success: false,
          message: "Invalid token or user not found",
          error: error ? error.message : "User not found",
        };
      } else {
        userId = data.user.id;
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to verify user",
        error: (error as Error).message,
      };
    }

    // Add the user to the house
    const { data, error } = await supabase.from("house_members").insert({
      house_id: houseId,
      user_id: userId,
      waiting_for_approval: true,
    });

    if (error) {
      return {
        success: false,
        message: "Failed to join house",
        error: error.message,
      };
    }

    return {
      message: `User joined house with ID ${houseId}`,
      success: true,
      data,
    };
  })
  .post("/getHouse", async ({ body, supabase }) => {
    // Get the user's house

    const { token } = body as {
      token: string;
    };

    let userId = "";

    // Check the user exists
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return {
          success: false,
          message: "Invalid token or user not found",
          error: error ? error.message : "User not found",
        };
      } else {
        userId = data.user.id;
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to verify user",
        error: (error as Error).message,
      };
    }

    const { data, error } = await supabase
      .from("house_members")
      .select("house_id")
      .eq("user_id", userId)
      .single();
    if (error) {
      return {
        success: false,
        message: "Failed to get house",
        error: error.message,
      };
    }
  })
  .post("approveMember", async ({ body, supabase }) => {
    const { houseId, userId, token } = body as {
      houseId: string;
      userId: string;
      token: string;
    };

    // Check the user exists
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return {
          success: false,
          message: "Invalid token or user not found",
          error: error ? error.message : "User not found",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to verify user",
        error: (error as Error).message,
      };
    }

    // Check if the user is the house owner

    const { data: houseData, error: houseError } = await supabase
      .from("houses")
      .select("created_by")
      .eq("id", houseId)
      .single();
    if (houseError || !houseData) {
      return {
        success: false,
        message: "House not found or error retrieving house data",
        error: houseError ? houseError.message : "House not found",
      };
    }

    // Approve the member
    const { data, error } = await supabase
      .from("house_members")
      .update({ waiting_for_approval: false })
      .eq("house_id", houseId)
      .eq("user_id", userId);

    if (error) {
      return {
        success: false,
        message: "Failed to approve member",
        error: error.message,
      };
    }

    return {
      message: `Member with ID ${userId} approved for house with ID ${houseId}`,
      success: true,
      data,
    };
  })
  .post("getHouseMembers", async ({ body, supabase }) => {
    const { houseId, token } = body as {
      houseId: string;
      token: string;
    };

    let userId = "";

    // Check the user exists
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return {
          success: false,
          message: "Invalid token or user not found",
          error: error ? error.message : "User not found",
        };
      } else {
        userId = data.user.id;
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to verify user",
        error: (error as Error).message,
      };
    }

    // Check if the user is in the house

    const { data: memberData, error: memberError } = await supabase
      .from("house_members")
      .select("user_id")
      .eq("house_id", houseId)
      .eq("user_id", userId)
      .single();

    if (memberError || !memberData) {
      return {
        success: false,
        message: "User is not a member of the house",
        error: memberError ? memberError.message : "User not found in house",
      };
    }

    // Get the house members
    const { data, error } = await supabase
      .from("house_members")
      .select("user_id, waiting_for_approval")
      .eq("house_id", houseId);

    if (error) {
      return {
        success: false,
        message: "Failed to get house members",
        error: error.message,
      };
    }

    return {
      message: `House members retrieved for house with ID ${houseId}`,
      success: true,
      data,
    };
  });
