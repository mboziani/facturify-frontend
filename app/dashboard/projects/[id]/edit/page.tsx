import EditProjectContent from './EditProjectContent';

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
    return <EditProjectContent id={params.id} />;
}
