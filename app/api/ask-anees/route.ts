import { chatProxy, chatStatus } from "@/lib/ask-anees/server";

export function GET(request: Request) { return chatStatus(request); }
export function POST(request: Request) { return chatProxy(request); }
