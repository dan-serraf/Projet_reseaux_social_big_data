import React from 'react'

export default class Message extends React.Component {

  render() {
    let id = this.props.index;
    return (
      <div className="accordion-item">
        <h2 className="accordion-header" id={"heading" + id}>
          <button className="collapsed container accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + id} aria-expanded="true" aria-controls={"#collapse" + id}  >
            {this.props.texte}
          </button>
        </h2>
        <div id={"collapse" + id} className="accordion-collapse collapse" aria-labelledby={"heading" + id} data-bs-parent="#accordionMessage">
          <div className="accordion-body">

            <div className="container">

              <a className="a_message" onClick={() => this.props.setCurrentPage("profil", this.props.author_id)}>{this.props.author_name}  {(new Date(this.props.date)).toLocaleDateString('fr-FR', { hour: "2-digit", minute: "2-digit" })}</a>

              {this.props.uid === this.props.author_id && <button type="button" className="btn btn-dark bar_recherche" onClick={() => this.props.deleteMsg(this.props.ident)}>X</button>}

            </div>

          </div>

        </div>

      </div>
    )
  }
}

// 
// aria-labelledby={"heading" + id}

//  <button className="accordion-button collapsed container" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + id}  >
