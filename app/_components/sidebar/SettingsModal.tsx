"use client"
import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import Input from '../Input';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';
import Button from '@/app/(site)/_components/Button';

interface SettingsModalProps {
    currentUser: User;
    isOpen?: boolean;
    onClose: () => void;
}

const SettingsModal = ({
    currentUser,
    isOpen,
    onClose
}: SettingsModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.iamge,
        }
    });
    const image = watch('image');
    const handleUpload = (result: any) => {
        setValue('image', result?.info?.secure_url, {
            shouldValidate: true,
        });
    }
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios.post(`/api/settings`, data).then(()=>{
            router.refresh();
            onClose();
        }).catch(() => toast.error("Something went wrong")).finally(() => {
            setIsLoading(false);
        })
    }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-12'>
                <div className='border-b border-gray-900/10 pb-12'>
                    <h2 className='text-base leading-7 text-gray-900'>Profile</h2>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>
                        Edit your public information.
                    </p>
                    <div className='mt-10 flex flex-col gap-y-8'>
                        <Input disabled={isLoading} label='name' id='name' errors={errors} required register={register}/>
                        <div>
                            <label htmlFor="" className='block text-sm font-medium leading-6 text-gray-900'>Photo</label>
                            <div className='mt-2 flex items-center gap-x-3'>
                                <Image 
                                    width={48}
                                    height={48}
                                    className='rounded-full'
                                    src={image || currentUser?.iamge || '/images/placeholder.png'}
                                    alt='avatar'
                                />
                                <CldUploadButton
                                    options={{maxFiles: 1}}
                                    onSuccess={handleUpload}
                                    uploadPreset='x4xzzife'
                                >
                                    <Button disabled={isLoading} secondary type='button'>
                                        Change
                                    </Button>
                                </CldUploadButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-6 flex items-center justify-end gap-x-6'>
                    <Button disabled={isLoading} secondary onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={isLoading} type='submit'>
                        Save
                    </Button>
                </div>
            </div>
        </form>
    </Modal>
  )
}

export default SettingsModal
