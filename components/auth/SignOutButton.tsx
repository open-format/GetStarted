import React from "react";
import { supabase } from "../../utils/supabaseClient";
import { useLoggedInAddress } from "../../contexts/LoggedInAddressContext";

const SignOutButton: React.FC = () => {
  const { setLoggedInAddress } = useLoggedInAddress();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      // Remove the "supabase-auth-token" cookie. https://github.com/supabase/auth-helpers/issues/178
      document.cookie =
        "supabase-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setLoggedInAddress(null); // Set the loggedInAddress to null
      window.location.reload();
    }
  };

  return (
    <button
      className="bg-gray-100 w-28 p-2 rounded-lg mx-auto hover:bg-gray-200 cursor-pointer transition-all duration-3000 "
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
};

export default SignOutButton;
