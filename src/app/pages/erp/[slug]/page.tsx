import ErpModuleDetailPageContent from '@/components/erp-module-detail-page'

type ErpLegacyModuleRoutePageProps = {
  params: Promise<{ slug: string }>
}

export default async function ErpLegacyModuleRoutePage({ params }: ErpLegacyModuleRoutePageProps) {
  const { slug } = await params

  return <ErpModuleDetailPageContent slug={slug} />
}
