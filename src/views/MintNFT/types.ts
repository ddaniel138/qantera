import { MintChecklistItem } from "@/types/mintNFT";

export type ChecklistItem = MintChecklistItem;

export interface AttributeItem {
    trait: string;
    value: string;
}

export interface NFTStats {
    supply: { current: number; total: number };
    price: string;
    limit: string;
}