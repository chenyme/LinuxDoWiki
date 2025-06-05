import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')
 
export async function generateMetadata(props: { params: { mdxPath: string[] } }) {
  const { mdxPath } = props.params
  const { metadata } = await importPage(mdxPath)
  return metadata
}
 
const Wrapper = getMDXComponents().wrapper
 
type PageProps = {
  params: {
    mdxPath: string[]
  }
}

export default async function Page({ params }: PageProps) {
  const { mdxPath } = params
  const result = await importPage(mdxPath)
  const { default: MDXContent, toc, metadata } = result
  return (
    <Wrapper toc={toc} metadata={metadata}>
        <MDXContent params={params} />
    </Wrapper>
  )
}