import ErpModuleDetailPageContent from '@/components/erp-module-detail-page'

type ErpModuleRoutePageProps = {
  params: Promise<{ slug: string }>
}

export default async function ErpModuleRoutePage({ params }: ErpModuleRoutePageProps) {
  const { slug } = await params

  return <ErpModuleDetailPageContent slug={slug} />
}