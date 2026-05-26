import styles from '../message_date/message_date.module.css';

function MessageDate({ date }) {

    const formattedDate =
        new Date(date).toLocaleDateString(
            'ru-RU',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }
        );

    return (
        <p>
            {formattedDate}
        </p>
    );
}

export default MessageDate;
