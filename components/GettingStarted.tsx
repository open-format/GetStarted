// This component is just to get you started.
// Feel free to tweak, modify, or even delete it entirely before moving
// forward with building your awesome application.

import { getActionsByUserAndRequirements } from "@/queries";
import RewardSystem from "@/utils/RewardSystem";
import { CheckCircleIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
  ConnectButton,
  fromWei,
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
  rewardSystem,
}: {
  rewardSystem: RewardSystem;
}) {
  const { isConnected, address } = useWallet();
  const [isLoading, setLoading] = useState<boolean>(false);

  // Fetch the data related to the user's actions and requirements
  const { data, refetch } = useRawRequest<any, any>({
    query: getActionsByUserAndRequirements,
    variables: {
      user: address?.toLocaleLowerCase(),
      app: process.env.NEXT_PUBLIC_APP_ID,
    },
  });

  // Refetch the data whenever isConnected, isLoading or refetch change
  useEffect(() => {
    refetch();
  }, [isConnected, isLoading, refetch]);

  // handleConnect is an async function that handles the connection process
  // and rewards the user with tokens upon successful connection.
  async function handleConnect() {
    setLoading(true);

    if (address) {
      await toast.promise(
        rewardSystem.handleCompletedAction(address, "connect"),
        {
          loading: "Rewarding tokens...",
          success: (data) => {
            for (const token of data.rewarded) {
              let message = `You completed the `;
              if (token.activityType === "ACTION") {
                message += `${token.id} action `;
              } else if (token.activityType === "MISSION") {
                message += `${token.id} mission `;
              }
              message += `and received ${fromWei(token.amount)} ${token.type}`;

              setLoading(false);
              return message;
            }
          },
          error: "An error occurred",
        },
        { duration: 5000 }
      );
    }
  }

  const firstActionComplete = Boolean(data?.actions?.length);

  // Define the tasks that the user needs to complete
  const tasks = [
    {
      title: "Connect your wallet",
      description: "Connect your web3 wallet. We recommend Metamask.",
      href: false,
      completed: isConnected,
      component: <ConnectButton />,
    },
    {
      title: "Create your XP token",
      description: "Visit the admin page to create your XP token.",
      href: "/admin",
      disabled: !isConnected,
      component: <ChevronRightIcon className="h-5 w-5" />,
    },
    {
      title: "Update your actions",
      description:
        "After creating your XP Token, you can add the address  to the connect action in actions.json that already exists.",
      href: false,
      disabled: !isConnected,
    },
    {
      title: "Trigger your first action 🚀",
      description: "",
      href: false,
      completed: firstActionComplete,
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
      href: "https://github.com/open-format/dapp-template",
      component: <ChevronRightIcon className="h-5 w-5" />,
    },
  ];

  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
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
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {task.title}
                </a>
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
                {task.description}
              </p>
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
                  {!task.disabled && <a href={task.href}>{task.component}</a>}
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
