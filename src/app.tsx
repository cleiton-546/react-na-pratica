import { FileDown, MoreHorizontal, Plus, Search, Filter  } from 'lucide-react'
import { Header } from './components/header'
import { Pagination } from './components/pagination'
import { Tabs } from './components/tabs'
import { Button } from './components/ui/button'
import { Control, Input } from './components/ui/input'
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from './components/ui/table'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'


export interface TagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: tag[]
}

export interface tag {
  title: string
  amountOfVideos: number
  id: string
}



export function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlFilter = searchParams.get("filter") ?? ""

  const [filter, setFilter] = useState('')


  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  const { data: tagResponse, isLoading } = useQuery<TagResponse>({
    queryKey: ['get-tags', urlFilter, page],
    queryFn: async () => {
        const response = await fetch(`http://localhost:3333/tags?_page=${page}&_per_page=10&title=${urlFilter}`)
        const data = await response.json()

        await new Promise(resolve => setTimeout(resolve, 2000))

        return data
    },
    placeholderData: keepPreviousData,
  })   

  function handleFilter() {
    setSearchParams(params => {
        params.set('page', "1")
        params.set("filter", filter)

        return params
    })
  }

  if (isLoading) {
    return null
  }
    return (
        <div className='py-10 space-y-8'>
            <div>
                <Header/>
                <Tabs/>
            </div>
            <main className='max-w-6xl mx-auto space-y-5'>
                <div className='flex items-center gap-3'>
                    <h1 className='text-xl font-bold'>Tags</h1>
                    <Button variant='primary'>
                        <Plus className='size-3'/>
                        Create new  

                    </Button>
                </div>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center'>

                    
                       <Input variant='filter'>
                        <Search className='size-3'/>
                        <Control placeholder='Search tags...'
                        onChange={e => setFilter(e.target.value)}
                        value={filter}
                        />
                       </Input>

                       <Button onClick={handleFilter}>
                       <Filter className='size-3'/>
                        filter
                       </Button>
                    </div>
                    <Button>
                        <FileDown className='size-3'/>
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Tag</TableHead>
                            <TableHead>Amount of videos</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tagResponse?.data.map((tag) => {
                            return(
                              <TableRow key={tag.id}>
                                 <TableCell></TableCell>
                                 <TableCell>
                                   <div className='flex flex-col gap-0.5'>
                                     <span className='font-medium'>{tag.title}</span>
                                     <span className='text-xs text-zinc-500'>{tag.id}</span>
                                   </div>
                                 </TableCell> 
                                 <TableCell className='text-zinc-500'>
                                     {tag.amountOfVideos} video(s)
                                 </TableCell>  
                                 <TableCell className='text-right'>
                                     <Button>
                                         <MoreHorizontal className='size-4'/>
                                     </Button>
                                 </TableCell>      
                              </TableRow>
                             )  
                        })}
                    </TableBody>
                </Table>
                {
                    tagResponse && <Pagination pages={tagResponse.pages} items={tagResponse.items} page={page}/>
                }

            </main>


        </div>
    )
}