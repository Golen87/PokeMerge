export interface Item {
	category: string;
	tier: number;
}

export default interface ItemData {
	key: string;
	name: string;
	scale?: number;
	generator?: {
		maxCharges: number;
		rechargeCount?: number;
		rechargeTime: number;
		depletable?: boolean;
		depleteDrop?: Item;
		items: Item[];
		shuffleItems?: boolean;
	};
	dispenser?: {
		maxCharges: number;
		rechargeCount?: number;
		rechargeTime: number;
		item: Item;
	};
}
