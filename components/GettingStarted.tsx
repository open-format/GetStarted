// This component is just to get you started.
// Feel free to tweak, modify, or even delete it entirely before moving
// forward with building your awesome application.
import {
  getActionsByUserAndRequirements,
  getTokenByName,
} from "@/queries";
import { User } from "@/types";
import TokenSystem from "@/utils/TokenSystem";
import {
  CheckCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import {
  ConnectButton,
  fromWei,
  RewardType,
  toWei,
  useOpenFormat,
  useRawRequest,
  useWallet,
} from "@openformat/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../components";
import Login from "./auth/Login";
import { useLoggedInAddress } from "@/contexts/LoggedInAddressContext";

// The GettingStarted component displays a list of tasks for users to complete.
// It accepts a rewardSystem prop, an instance of the RewardSystem utility class.
export default function GettingStarted({
  tokenSystem,
}: {
  tokenSystem: TokenSystem;
}) {
  const { isConnected, address } = useWallet();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { sdk } = useOpenFormat();
  const { loggedInAddress } = useLoggedInAddress();

  // Fetch the data related to the user's actions and requirements
  const { data, refetch } = useRawRequest<any, any>({
    query: getActionsByUserAndRequirements,
    variables: {
      user: loggedInAddress?.toLocaleLowerCase(),
      app: process.env.NEXT_PUBLIC_APP_ID,
    },
  });

  const { data: TokenData, isLoading: loadingTokenData } =
    useRawRequest<any, any>({
      query: getTokenByName,
      variables: {
        app: process.env.NEXT_PUBLIC_APP_ID,
        name: "XP",
      },
    });

  // Refetch the data whenever isConnected, isLoading or refetch change
  useEffect(() => {
    refetch();
  }, [isConnected, isLoading, refetch]);

  // handleCreateXPToken is an async function that handles the creation of a new token
  // of an XP token for the app.
  async function handleCreateXPToken() {
    if (loggedInAddress) {
      await toast
        .promise(
          sdk.Reward.createRewardToken({
            name: "XP",
            symbol: "XP",
            supply: toWei("0"),
          }),
          {
            loading: "Creating XP Token",
            success: "XP token created",
            error: "Error creating XP Token, please try again",
          }
        )
        .then(() => {
          setTimeout(() => {
            refetch();
            location.reload();
          }, 3000);
        });
    }
  }

  // handleConnect is an async function that handles the connection process
  // and rewards the user with tokens upon successful connection.
  async function handleConnect() {
    setLoading(true);

    const loadingToast = toast.loading("sending tokens...");

    if (loggedInAddress) {
      const data: User = await tokenSystem
        .handleCompletedAction(loggedInAddress, "connect")
        .catch((error: string) => {
          toast.error("Sending tokens failed. Please try again.");
          throw new Error(error);
        });
      toast.dismiss(loadingToast);

      for (const token of data.rewarded) {
        let message = `You completed the `;
        if (token.activityType === "ACTION") {
          message += `${token.id} action and received ${fromWei(
            token.amount.toString()
          )} ${token.type}`;
        } else if (token.activityType === "MISSION") {
          if (token.type === RewardType.BADGE) {
            message += `${
              token.id
            } mission and received ${token.amount.toString()} ${
              token.type
            }`;
          } else {
            message += `${token.id} mission and received ${fromWei(
              token.amount.toString()
            )} ${token.type}`;
          }
        }

        setLoading(false);
        toast.success(message, { duration: 5000 });
      }
    }
  }

  const firstActionComplete = Boolean(data?.actions?.length);

  const xpTokenId = TokenData?.contracts?.[0]?.id || "";

  // Define the tasks that the user needs to complete
  const tasks = [
    {
      title: "Connect your wallet",
      description: "Connect your web3 wallet. We recommend Metamask.",
      href: undefined,
      completed: isConnected,
      component: <Login />,
    },
    {
      title: "Create your XP token",
      description:
        "Click to create your XP Token. You will see your created token on the admin page.",
      completed:
        isConnected && TokenData && TokenData.contracts.length,
      disabled: !isConnected,
      component: (
        <Button onClick={handleCreateXPToken} disabled={!isConnected}>
          Create XP Token
        </Button>
      ),
    },
    {
      title: "Update your actions",
      description: "",
      descriptionElement: (
        <div className="text-xs leading-5 text-gray-500">
          {xpTokenId
            ? "Copy the ID of your XP Token and add it to the connect action in actions.json. Your XP token ID:"
            : "Copy the ID of your XP Token and add it to the connect action in actions.json once it's available."}
          {xpTokenId && (
            <span
              className="ml-1 text-gray-600 font-bold cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(xpTokenId);
                toast.success("Token ID copied to clipboard!");
              }}
            >
              {xpTokenId}
            </span>
          )}
        </div>
      ),
      href: undefined,
      disabled: !isConnected,
    },
    {
      title: "Trigger your first action 🚀",
      description:
        "Once you've updated your action, you can trigger your first action!",
      href: undefined,
      completed: isConnected && firstActionComplete,
      disabled: !isConnected,
      component: (
        <Button onClick={handleConnect} disabled={!isConnected}>
          Trigger Action
        </Button>
      ),
    },
    {
      title: "View completed actions",
      description: "View actions",
      href: "/profile",
      component: <ChevronRightIcon className="h-5 w-5" />,
      disabled: !isConnected || !firstActionComplete,
    },
    {
      title: "View Docs",
      description:
        "Discover more features of this template and learn about the next steps.",
      href: "https://github.com/open-format/hello-world",
      component: <ChevronRightIcon className="h-5 w-5" />,
    },
  ];

  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl "
    >
      {tasks.map((task) => (
        <li
          key={task.title}
          className={clsx(
            {
              "opacity-50 bg-gray-200 cursor-not-allowed pointer-events-none":
                task.disabled,
            },
            "relative flex justify-between gap-x-6 px-4 py-5 sm:px-6"
          )}
        >
          <div className="flex gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                <a href={task.href}>
                  {task.title !== "Update your actions" ||
                  !xpTokenId ? (
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                  ) : null}
                  {task.title}
                </a>
              </p>
              {task.descriptionElement || (
                <p className="mt-1 flex text-xs leading-5 text-gray-500">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            <div className="sm:flex sm:flex-col sm:items-end">
              {task.completed ? (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <CheckCircleIcon className="h-5 w-5 flex-none text-emerald-500" />
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5 z-10">
                  {!task.disabled && (
                    <a href={task.href}>{task.component}</a>
                  )}
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
      <Button onClick={handleConnect} disabled={!loggedInAddress}>
        Trigger Action
      </Button>
    </ul>
  );
}
