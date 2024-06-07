import React, { FC, useState } from 'react'
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai'
import { FaPlus } from 'react-icons/fa'
import { Form, useLoaderData } from 'react-router-dom'
import CategoryModal from '../components/CategoryModal'
import { instance } from '../api/axios.api'
import { ICategory } from '../types/types'

export const categoriesAction = async ({ request }: any) => {
    switch (request.method) {
        case "POST": {
            const formData = await request.formData()
            const title = {
                title: formData.get('title')
            }
            await instance.post('category/create', title)
            return null
        }
        case "PATCH": {
            const formData = await request.formData()
            const category = {
                id: formData.get('id'),
                title: formData.get('title')
            }
            await instance.patch(`category/category/${category.id}`, category)
            return null
        }
        case "DELETE": {
            const formData = await request.formData()
            const categoryId = formData.get('id')
            await instance.delete(`category/category/${categoryId}`)
            return null
        }
    }
}

export const categoryLoader = async () => {
    const { data } = await instance.get<ICategory[]>('category/findAll')
    return data
}

const Categories: FC = () => {
    const categories = useLoaderData() as ICategory[]
    const [categoryId, setCategoryId] = useState<string>('')
    const [categoryTitle, setCategoryTitle] = useState<string>('')
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    return (
        <>
            <div className='mt-10 rounded-md bg-slate-800 p-4'>
                <h1>Your categories list: </h1>
                {/* Categories list */}
                <div className='mt-2 flex flex-wrap items-center gap-2'>
                    {categories.map((category, idx) => (
                        <div key={idx} className='group py-2 px-4 rounded-lg bg-blue-600 flex items-center relative gap-2'>
                            {category.title}
                            <div className='absolute px-3 left-0 top-0 bottom-0 right-0 rounded-lg bg-black/90 hidden items-center justify-between group-hover:flex'>
                                <button onClick={() => {
                                    setCategoryId(category.id)
                                    setCategoryTitle(category.title)
                                    setVisibleModal(true)
                                    setIsEdit(true)
                                }}>
                                    <AiFillEdit />
                                </button>
                                <Form className='flex' method='delete' action='/categories'>
                                    <input type='hidden' name='id' value={category.id}></input>
                                    <button type='submit'>
                                        <AiFillCloseCircle />
                                    </button>
                                </Form>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Add Categories */}
                <button onClick={() => setVisibleModal(!visibleModal)} className='flex mt-5 max-w-fit items-center gap-2 text-white/50 hover:text-white'>
                    <FaPlus />
                    <span>Create new a Category</span>
                </button>
            </div>
            {/* Add category modal */}
            {visibleModal && (<CategoryModal type='post' setVisibleModal={setVisibleModal} />)}

            {/* Edit category modal */}
            {visibleModal && isEdit && (<CategoryModal type='patch' id={categoryId} title={categoryTitle} setVisibleModal={setVisibleModal} />)}
        </>
    )
}

export default Categories