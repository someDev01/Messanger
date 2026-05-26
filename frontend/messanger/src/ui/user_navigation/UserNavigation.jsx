import NavigationButton from '../navigation_button/navigationButton';
import styles from '../user_navigation/user_navigation.module.css';

function UserNavigation({activeTab, setActiveTab}){
    return(
        <div className={styles.navigation}>
            <NavigationButton 
                type='chats'
                active={activeTab === 'chats'}
                onClick={() => setActiveTab('chats')}
            />
            <NavigationButton 
                type='settings'
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
            />
        </div>
    )
}

export default UserNavigation;