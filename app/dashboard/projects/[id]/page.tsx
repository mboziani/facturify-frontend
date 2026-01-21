import ProjectDetailContent from './ProjectDetailContent';

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
    return <ProjectDetailContent id={params.id} />;
}
