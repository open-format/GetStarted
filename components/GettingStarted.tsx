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

  // Fetch the data related to the user's actions and requirements
  const { data, refetch } = useRawRequest<any, any>({
    query: getActionsByUserAndRequirements,
    variables: {
      user: address?.toLocaleLowerCase(),
      app: process.env.NEXT_PUBLIC_CONSTELLATION_ID,
    },
  });

  const { data: TokenData, isLoading: loadingTokenData } =
    useRawRequest<any, any>({
      query: getTokenByName,
      variables: {
        app: process.env.NEXT_PUBLIC_CONSTELLATION_ID,
        name: "Action Token",
      },
    });
  // Refetch the data whenever isConnected, isLoading or refetch change
  useEffect(() => {
    refetch();
  }, [isConnected, isLoading, refetch]);

  // handleCreateXPToken is an async function that handles the creation of a new token
  // of an XP token for the app.
  async function handleCreateActionToken() {
    if (address) {
      await toast
        .promise(
          sdk.Reward.createRewardToken({
            name: "Action Token",
            symbol: "ACTION",
            supply: toWei("0"),
          }),
          {
            loading: "Creating Action Token",
            success: "Action Token created",
            error: "Error creating Action Token, please try again",
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

    if (address) {
      const data: User = await tokenSystem
        .handleCompletedAction(address, "example")
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

  const actionTokenId = TokenData?.contracts?.[0]?.id || "";

  function ActionID({ actionTokenId }: { actionTokenId: string }) {
    function handleCopyToClipboard() {
      navigator.clipboard.writeText(actionTokenId);
      toast.success("Token ID copied to clipboard!");
    }
    return (
      <p>
        Add your Action Token ID{" "}
        <span
          className="text-gray-600 font-bold cursor-pointer"
          onClick={handleCopyToClipboard}
        >
          ({actionTokenId})
        </span>{" "}
        to the connect action in your configuration file.
      </p>
    );
  }

  // Define the tasks that the user needs to complete
  const tasks = [
    {
      title: "Connect your wallet",
      description: "Connect your web3 wallet. We recommend Metamask.",
      href: undefined,
      completed: isConnected,
      component: <ConnectButton />,
    },
    {
      title: "Trigger your first action 🚀",
      description:
        "Now you've connected, you can trigger your first action!",
      href: undefined,
      completed: isConnected && firstActionComplete,
      disabled: !isConnected,
      component: (
        <Button onClick={handleConnect} disabled={!isConnected}>
          Trigger "Example" Action
        </Button>
      ),
    },
    {
      title:
        "Congratulations! You have successfully triggered your first action 🎉",
      description:
        "Head over to your profile to see your completed actions.",
      href: "/profile",
      component: <ChevronRightIcon className="h-5 w-5" />,
      disabled: !isConnected || !firstActionComplete,
    },
    {
      title: "Complete your first mission 🚀",
      description:
        "Complete your first mission by triggering two more example actions",
      href: undefined,
      completed: false,
      disabled: !isConnected,
      component: (
        <Button onClick={handleConnect} disabled={!isConnected}>
          Trigger "Example" action
        </Button>
      ),
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
                  !actionTokenId ? (
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
    </ul>
  );
}
