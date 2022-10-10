import React, { useState } from 'react'
import { Modal, Title, Button } from '@mantine/core'
import { useViewportSize, useSessionStorage } from '@mantine/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Icons
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

// CSS
import './styles.css'

const MobileWarning = () => {
    const { _, width } = useViewportSize()
    const [hideWarning, setHideWarning] = useSessionStorage({ key: 'hideWarning', defaultValue: false })
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (width && width < 1024) {
        if (!hideWarning && !isModalOpen) {
            setIsModalOpen(true)
        }
    }

    const continueAnyway = () => {
        setHideWarning(true)
        setIsModalOpen(false)
    }

    const ModalHeader = () => {
        return (
            <div className='warning-modal-header'>
                <FontAwesomeIcon color='gold' className='warning-modal-header-item' icon={faExclamationCircle} />
                <Title className='warning-modal-header-item' order={3}>Warning</Title>
            </div>
        )
    }

    return (
        <Modal
            centered
            opened={isModalOpen}
            onClose={continueAnyway}
            overlayOpacity={1}
            title={ModalHeader()}
            closeOnClickOutside={false}
        >
            <div className='warning-modal-content'>
                It looks like you're on a mobile device.
                <br />
                This website is best viewed on a desktop
            </div>
            <div className='warning-modal-button'>
                <Button onClick={continueAnyway} variant='outline'>
                    Continue anyway
                </Button>
            </div>
        </Modal>
    )
}

export default MobileWarning