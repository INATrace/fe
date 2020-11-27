# INATrace

Open-source blockchain-based track and trace system for an agricultural commodities (such as coffee) supply
chain run. It provides transparency and creation of trust through
digitalization of supply chains, connects every actor along the supply chain, assures quality and fair pricing.

Project is composed from 3 parts:

* [Java backend](https://github.com/INATrace/backend/tree/main) (Authentication, User, Product, Company APIs)
* [Coffee network](https://github.com/INATrace/coffee-network/tree/main) (StockOrder, Transaction, Order, SemiProduct APIs)
* [FE](https://github.com/INATrace/fe/tree/main)

# Frontend

## Installing / Getting started

#### Requirements
* Node 12
* Angular 10
* VS Code (recommended)
* VS Code pluggins:
	* Debugger for Chrome
	* EditorConfig for VS Code
	* npm support for VS Code
	* HTML Format (from Mohamed)

#### How to run
1. Clone the repository
	
2.  Run ```npm install```

3. Open project in VS Code as working directory
4. Generate API-s with running tasks `Generate API classes` and `Generate Chain API classes` to include APIs from Java backend and Coffee network projects
4. Set environment as in [`environment.example.ts`](https://github.com/INATrace/fe/blob/main/src/environments/environment.example.ts)
5. Run Angular server with debugger by pressing `F5`
	* Tasks in VS Code:
		* Press `Ctrl +Shift+P` or `Cmd+Shift+P` and choose Tasks: Run Task and run desired task
		* New tasks can be added in `tasks.json`


## Contribution

Project INATrace welcomes contribution from everyone. See CONTRIBUTING.md for help getting started.

## License 

Copyright (c) 2020 Antje ECG d.o.o., GIZ - Deutsche Gesellschaft für Internationale Zusammenarbeit GmbH

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
