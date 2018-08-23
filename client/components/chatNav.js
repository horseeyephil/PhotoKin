const React = require('react')

const lilNav = props => (
    <div style={{display: 'flex', justifyContent: 'space-between', border: '1px solid black', height: '12%'}}>
        <button onClick={()=>props.toggleUserList()}
            style={{width: '15%', height: '100%', verticalAlign: 'middle', textAlign: 'center'}}>back</button>
        <span>{props.userName || 'Oauth with facebook to chat!'}</span>
               <button onClick={props.toggleCollapse}>Collapse</button>
    </div>
)

export default lilNav