import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')
 
export async function generateMetadata(props: { params: Promise<{ mdxPath: string[] }> }) {
  const params = await props.params
  const { mdxPath } = params
  const { metadata } = await importPage(mdxPath)
  return metadata
}
 
const Wrapper = getMDXComponents().wrapper
 
type PageProps = {
  params: Promise<{
    mdxPath: string[]
  }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { mdxPath } = resolvedParams
  const result = await importPage(mdxPath)
  const { default: MDXContent, toc, metadata } = result
  return (
    <Wrapper toc={toc} metadata={metadata}>
        <MDXContent params={resolvedParams} />
    </Wrapper>
  )
}