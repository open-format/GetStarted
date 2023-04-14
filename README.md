## What is hello world

Coming soon.

## Prerequisites

1. Web3 wallet - We recommend [Metamask](https://metamask.io/), although a list of wallets supported by Ethereum can be found [here](https://ethereum.org/en/wallets/find-wallet/#main-content). We've created a [video](https://www.youtube.com/watch?v=ZS7VuGZ5VgI&list=PLtnXR6ERygvJ6qT6UYSH8Ve3RAdgYJN26&index=6&t=801s) that explains what web3 wallets are, why you need one, and how to use them.
2. Generate an App ID at [https://apps.openformat.tech/](https://apps.openformat.tech/). As Open Format supports multiple networks, make sure you create an App ID on the same network that you use in your template.
3. You'll need to have **Node 14.6.0** or a later version installed on your local development machine. We recommend using the latest LTS version available.

## Quickstart

### Install dependencies

```bash
npm install or yarn install
```

### Setup your environment variables

```bash
cp .env.local.example .env.local
```

| Variable                      | Description                                                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| NEXT_PUBLIC_APP_ID            | Your generated App ID.                                                                                                       |
| NEXT_PRIVATE_KEY              | The private key of the wallet used to trigger rewards. This must be the same wallet that created the App ID.                 |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Web2 Auth only - The unique Supabase Key which is supplied when you create a new project in your supabase project dashboard. |
| NEXT_PUBLIC_SUPABASE_URL      | Web2 Auth only - The unique Supabase URL which is supplied when you create a new project in your supabase project dashboard. |

### Run the app

```bash
npm run dev or yarn run dev
```

## Rewards Mechanism

The rewards mechanism is a system that rewards users with XP tokens, reward tokens, and badges for completing actions and missions. The mechanism is implemented through the Open Format SDK and handles all on-chain rewards. All actions and missions are logged on-chain and can be viewed through the subgraph. If you want to see how the reward mechanism works it’s here.

### XP, Reward Tokens and Badges

XP tokens are fungible (ERC20) tokens that are rewarded to users for completing actions. Reward tokens are fungible tokens (ERC20) that are transferred from the app owners wallet upon completion of a mission. Badges are NFTs (ERC721) that are minted once a mission is completed.

Only XP tokens can be rewarded for completing actions. Multiple reward tokens and badges can be rewarded for each completed mission.

### Setup

XP Tokens - To create an XP token, visit the `admin` page and choose XP from the dropdown list.

Reward Tokens and Badges - To create reward tokens and badges, visit the `admin` page. You can also view any existing reward tokens and badges here. They are created using the Open Format SDK, so you can add this logic anywhere in the app, even in another app entirely. We will be integrating this functionality into our Dashboard app soon.

### XP/Reward token example

| Key    | Description                            | Example           |
| ------ | -------------------------------------- | ----------------- |
| Name   | Your generated App ID.                 | Open Format Token |
| Symbol | The symbol of your token               | OFT               |
| Supply | How many tokens you want in the system | 1000              |

### Badge example

| Key      | Description                                    | Example                                                                                                                                                   |
| -------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name     | The name of your badge                         | Connect Badge                                                                                                                                             |
| Symbol   | The symbol of your token                       | CONNECT                                                                                                                                                   |
| TokenURI | A url that links to the metadata for the badge | [ipfs://bafkreib2ofqfcgpe5laipvgalzvf24aqbz7tmbktz36zkvt54wnkldzm2i](https://bafkreib2ofqfcgpe5laipvgalzvf24aqbz7tmbktz36zkvt54wnkldzm2i.ipfs.dweb.link/) |

## Actions

### What are actions

An action is simply when a user does something in your app, such as connecting their wallet, posting a comment or sending a message. For each action, they will be rewarded with a certain amount of XP tokens.
You can set which actions you want users to be rewarded for and the amount of XP tokens they will receive for each action.
Once a user completes an action, the reward mechanism will handle the processing of the on-chain rewards via the Open Format SDK.
You can view completed actions via the Open Format subgraph.

### Setup

1. Edit the action config in `actions.json`
2. instantiate the reward system `const rewardSystem = new RewardSystem(sdk)`
3. Add an action trigger pass the web3 wallet address of the reward receiver and the id of the action set in `actions.json`

```jsx
async function handleConnect() {
  if (address) {
    await rewardSystem.handleCompletedAction(address, "connect");
  }
}
```

### Actions config

```json
[
  {
    "id": "connect",
    "amount": 10,
    "description": "Connect your wallet",
    "address": "0x27498c5aa1ea3f09963a9abf9882a4690d99c4fd"
  }
]
```

The `actions.json` file configures which actions should be rewarded and how many XP tokens should be awarded for each action. The file specifies an `id` for each action, which should be used as a reference in the `handleCompletedAction` function. The `amount` field specifies the number of XP tokens that should be awarded for completing the action, and the `description` field provides a brief description of the action. The `address` field specifies the address of the XP token that’s being rewarded.

### View completed actions

You can view completed mission on-chain using our subgraph. You can see an example [here](https://api.thegraph.com/subgraphs/name/open-format/mumbai/graphql?query=%7B%0A++actions%28first%3A+2%2C+where%3A+%7Bapp%3A+%220xfa6439e79bd79d245bded41d1bd16f2166347884%22%7D%29+%7B%0A++++amount%0A++++type_id%0A++++token+%7B%0A++++++id%0A++++%7D%0A++++user+%7B%0A++++++id%0A++++%7D%0A++%7D%0A%7D)

## Missions

### What are missions

Missions are sets of actions that users must complete in order to earn rewards. Once a user has completed all the required actions for a mission, they can receive reward tokens and/or badges. The requirements for each mission are defined in the `missions.json` file, which specifies the actions that need to be completed and how many times each action needs to be completed. Missions are automatically triggered when a set of required actions have been completed. Completed missions can be viewed via the Open Format subgraph.

### Setup

1. Create your Reward tokens and badges.
2. Edit the missions config in `missions.json`

### Missions config

```json
[
  {
    "id": "connect_and_share_mission",
    "description": "Connect twice times and share once",
    "tokens": [
      {
        "address": "0xc8a0c0aCc1ABbD8cE65Df85533e8CCe0cE37B478",
        "amount": 20
      },
      {
        "address": "0x1a7ea9e50b714667fd8422b07933b0945540413c",
        "uri": "ipfs://"
      }
    ],
    "requirements": [
      {
        "actionId": "connect",
        "count": 3
      },
      {
        "actionId": "share",
        "count": 1
      }
    ]
  }
]
```

This JSON object describes a mission that requires the completion of certain actions. The **`id`**and **`description`**keys provide a name and description for the mission, respectively. The **`tokens`**key contains an array of objects that specify the tokens to be awarded for completing the mission, including the address of the token and the amount to be awarded. Finally, the **`requirements`**key contains an array of objects that specify the actions that must be taken to complete the mission and the number of times they must be completed. the `**actionId**` relates to the actions set in the `**actions.json**`

### View completed missions

You can view completed mission on-chain using our subgraph. You can see an example [here](https://api.thegraph.com/subgraphs/name/open-format/mumbai/graphql?query=%7B%0A++missions%28first%3A+2%2C+where%3A+%7Bapp%3A+%220xfa6439e79bd79d245bded41d1bd16f2166347884%22%7D%29+%7B%0A++++amount%0A++++type_id%0A++++token+%7B%0A++++++id%0A++++%7D%0A++++user+%7B%0A++++++id%0A++++%7D%0A++%7D%0A%7D)

## Architecture Diagram

This diagram illustrates how this template (interface) interacts with the Open Format ecosystem.
![architecture](https://user-images.githubusercontent.com/7047410/232025623-812b8301-9d78-40d8-91a0-44fb60943066.png)
