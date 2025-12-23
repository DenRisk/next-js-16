import {NextRequest} from "next/dist/server/web/spec-extension/request";
import {NextResponse} from "next/dist/server/web/spec-extension/response";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model"

export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const formData = await req.formData()

        let event;
        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({message: "Invalid JSON data format"}, {status: 400})
        }

        const tags = JSON.parse(event.tags as string);
        const agenda = JSON.parse(event.agenda as string);
        const createdEvent = await Event.create({
            ...event,
            agenda,
            tags
        })

        return NextResponse.json({message: "Event created successfully", event: createdEvent}, {status: 200})
    } catch (e) {
        return NextResponse.json({message: "Event Creation Failed", error: e instanceof Error ? e.message : 'Unknown'});
    }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({createdAt: -1});

        return NextResponse.json({message: 'Events fetched successfully', events}, {status: 200});
    } catch (e) {
        return NextResponse.json({message: 'Event fetching failed', error: e}, {status: 500});
    }
}