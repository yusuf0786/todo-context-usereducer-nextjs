type Todo = { id: number; text: string };
type Category = {
    categoryName: string;
    id: string;
    todos: Todo[];
};

const mocData: Category[] = [
    {
        categoryName: 'E.g. Life Todo List',
        id: `category1-${Date.now()}`,
        todos: [],
    },
    {
        categoryName: 'E.g. Groceries',
        id: `category2-${Date.now()}`,
        todos: [{ id: 12, text: 'Buy groceries' }],
    },
    {
        categoryName: 'E.g. Personal Tasks',
        id: `category3-${Date.now()}`,
        todos: [{ id: 1, text: 'test 1' }, { id: 2, text: 'test 2' }],
    },
];

const userData: Category[] = mocData;

export async function GET() {
    return Response.json(userData, {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(req: Request) {
    const data = await req.formData();
    const name = data.get("name")?.toString() || "";

    const newData: Category = {
        categoryName: name,
        id: `category-${Date.now()}`,
        todos: [],
    };

    const exists = userData.some((d) => d.categoryName === newData.categoryName);
    const passHeaders = {
        "Content-Type": req.headers.get("Content-Type") ?? "application/json",
    };

    if (exists) {
        return new Response(JSON.stringify({ error: "Item already exists" }), {
            status: 400,
            headers: passHeaders,
        });
    }

    userData.push(newData);
    return new Response(JSON.stringify({ message: "Added Successfully" }), {
        headers: passHeaders,
    });
}
