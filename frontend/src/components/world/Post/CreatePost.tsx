/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { VStack, Input, Textarea, Button, useToast, CloseButton, Container, Text, HStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import useApi from './useApi';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import { ServerPost, Coordinate } from '../../../classes/Post';
import { PostCreateRequest } from '../../../classes/TownsServiceClient';
import { calculateBytes } from '../../../Util';

/**
 * The properties of creating a post
 */
interface CreatePostProps {
    coordinate: Coordinate;
    closeCreatePost: () => void;
}

/**
 * What a post can contain, a title and some content
 */
type CreatePostStates = {
    title: string;
    content: string;
    file?: File,
}

/**
 * The initial state of a post, just empty strings
 */
const initalState = {
    title: '',
    content: '',
    file: undefined,
}

/**
 * JSON version of how a post should look visually
 */
const dropZoneStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

/**
 * The jsx element version of a post
 * @returns The jsx element of a post
 */
export default function CreatePost({ coordinate, closeCreatePost }: CreatePostProps): JSX.Element {
    const { userName, currentTownFriendlyName, currentTownID, sessionToken, apiClient } = useCoveyAppState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [state, setState] = useState<CreatePostStates>(initalState);
    const createPost = useApi(apiClient.createPost.bind(apiClient));
    const toast = useToast();

    const handleDropFile = (files: File[]) => {
        setState((prev: CreatePostStates) => ({
            ...prev,
            file: files[0],
        }));
    };

    const { getRootProps, getInputProps, open } = useDropzone({
        noClick: true,
        noKeyboard: true,
        maxFiles: 1,
        onDrop: handleDropFile,
    });

    const handleRemoveFile = () => {
        setState((prev: CreatePostStates) => ({
            ...prev,
            file: undefined,
        }));
    }

    /**
     * Response for when text in the post has changed
     * @param value The new text
     * @param field The field being changed
     */
    const handleTextInputChange = (value: string, field: string) => {
        setState((prev: CreatePostStates) => ({
            ...prev,
            [field]: value,
        }));
    };

    /**
     * Server's response to creating a post
     * @param result The message the server sends on if the post was created succesfully
     */
    const createPostCallback = (result: ServerPost) => {
        toast({
            title: 'Created post successfully',
            description: `Post ID: ${result._id}, Title: ${result.title}, File: ${result.file.filename}`,
            status: 'success',
        });
        closeCreatePost();
    };

    /**
     * Server's response to an error being thrown in the process of creating a post
     * @param error The error caused in the process of creating a post
     */
    const createPostError = (error: string) => {
        toast({
            title: 'Unable to create the post',
            description: error,
            status: 'error',
        });
    };

    /**
     * Server's response for when the commit (basically, submit your post) button is pressed
     */
    const handleCommitButtonClick = async () => {
        const postRequest: PostCreateRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            post: {
                title: state.title,
                postContent: state.content,
                ownerID: userName,
                isVisible: true,
                coordinates: coordinate,
                file: {
                    filename: '',
                    contentType: ''
                }
            },
            file: state.file,
        };
        createPost.request(postRequest, createPostCallback, createPostError);
    };

    const handleCloseButtonClick = async () => {
        onClose();
        closeCreatePost();
    };

    useEffect(() => {
        onOpen();
    }, [onOpen]);

    useEffect(() => {
        if ((createPost.data !== undefined) && !createPost.loading) {
            closeCreatePost();
        }
    }, [closeCreatePost, createPost.data, createPost.loading]);

    return (
        <Modal onClose={handleCloseButtonClick} size='xl' isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{`Post To Town: ${currentTownFriendlyName}`}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack
                        height='100%'
                        padding='10px'
                        border='2px'
                        borderWidth='0.5px'
                        borderStyle='dashed'
                        borderColor='gray.500'
                        borderRadius='8px'>
                        <VStack>
                            <Text alignSelf='start'>Post as <Text display='inline' color='tomato'>u/{userName}</Text></Text>
                            <Input
                                placeholder='Title'
                                size='md'
                                value={state.title}
                                onChange={({ target }) => handleTextInputChange(target.value, 'title')} />
                            <Textarea
                                placeholder='Text (optional)'
                                resize='vertical'
                                height='250px'
                                width='475px'
                                maxHeight='450px'
                                value={state.content}
                                onChange={({ target }) => handleTextInputChange(target.value, 'content')} />
                            <Container>
                                <div {...getRootProps({ style: dropZoneStyle })}>
                                    <input {...getInputProps()} />
                                    <Text display='inline'>Drag & Drop a file</Text>
                                    <Button display='inline' variant='outline' colorScheme='teal' size='xs' onClick={open} >
                                        Open File Dialog
                                    </Button>
                                </div>
                                <HStack marginTop='5px' alignItems='center'>
                                    {state.file ? <Text fontSize='xs'>{`File Type: ${state.file.type}, Size: ${calculateBytes(state.file.size)}`}</Text> : <></>}
                                    {state.file ? <CloseButton onClick={handleRemoveFile} alignSelf='end' size='sm' /> : <></>}
                                </HStack>
                            </Container>
                            <Button alignSelf='end' marginRight='100px' size='md' colorScheme="gray" isLoading={createPost.loading} loadingText="Committing" onClick={handleCommitButtonClick}>Commit</Button>
                        </VStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}