import styles from '../status/status.module.css';

function Status({isActive}){
    return(
        <div className={styles.status_block}>
            {isActive ? 
            <>
                <div style={{
                    display: 'flex',
                    width: '4px',
                    height: '4px',
                    padding: '4px',
                    backgroundColor: '#2eb25a',
                    borderRadius: '50%'
                }}></div>
                <p>в сети</p>
            </> : 
            <p>был последний раз в сети ...</p>}
        </div>
    )
}

export default Status;