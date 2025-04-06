const Navbar = ({ activeSection, setActiveSection }) => {
    const navItems = [
      { id: 'tier-list', label: 'Tier List' },
      { id: 'cat-api', label: 'Random Cat' },
      { id: 'joke-api', label: 'Random Joke' },
      { id: 'jsonplaceholder', label: 'JSONPlaceholder' }
    ]
  
    return (
      <header>
        <nav>
          <ul className="nav-menu">
            {navItems.map(item => (
              <li key={item.id}>
                <a 
                  href="#" 
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveSection(item.id)
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {activeSection === 'tier-list' && (
          <div className="header-buttons">
            <button id="edit-mode-toggle">Режим редактирования</button>
            <button id="add-tier-button">Добавить тир</button>
          </div>
        )}
      </header>
    )
  }
  
  export default Navbar