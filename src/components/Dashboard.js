import React, { Component } from "react";
import "./dashboard.css";
import { Col, Row, Container } from "react-bootstrap";
import WidgetText from "./WidgetText";
import WidgetBar from "./WidgetBar";
import WidgetDough from "./WidgetDough";
import Dropdown from "react-dropdown";
import WidgetPie from "./WidgetPie";
import "react-dropdown/style.css";

const config = {
  apiKey: "AIzaSyDMu-Vw30ykPPmFT3cXeunzKEi4EahzglI",
  spreadsheetId: "1vcDPrMexD8bxNwwzK9IxF8wch6Hfezq2eooJACDiqgg",
};
const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

const options = ["one", "two", "three"];
const defaultOption = options[0];

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      dropdownOptions: [],
      selectedValue: null,
      organicSource: null,
      directSource: null,
      referralSource: null,
      users: null,
      newUsers: null,
      socialSource: null,
      sessions: null,
      emailSource: null,
      sourceArr: [],
      userArr: [],
      emailsocialArr: [],
    };
  }

  getData = (arg) => {
    const arr = this.state.items;
    const arrlen = arr.length;

    let organicSource = 0;
    let directSource = 0;
    let referralSource = 0;
    let users = null;
    let newUsers = null;
    let socialSource = null;
    let sessions = null;
    let emailSource = null;
    let selectedValue = null;
    let sourceArr = [];
    let userArr = [];
    let emailsocialArr = [];

    for (let i = 0; i < arrlen; i++) {
      if (arg == arr[i]["month"]) {
        organicSource = arr[i].organic_source;
        directSource = arr[i].direct_source;
        referralSource = arr[i].referral_source;
        users = arr[i].users;
        newUsers = arr[i].new_users;
        socialSource = arr[i].social_source;
        emailSource = arr[i].email_source;
        sessions = arr[i].sessions;
        sourceArr.push(
          {
            label: "Organic Source",
            value: arr[i].organic_source,
          },
          {
            label: "Direct Source",
            value: arr[i].direct_source,
          },
          {
            label: "Referral Source",
            value: arr[i].referral_source,
          }
        );
        userArr.push(
          {
            label: "Users",
            value: arr[i].users,
          },
          {
            label: "New Users",
            value: arr[i].new_users,
          }
        );
        emailsocialArr.push(
          {
            label: "Email Source",
            value: arr[i].email_source,
          },
          {
            label: "Social Source",
            value: arr[i].social_source,
          }
        );
      }
    }
    selectedValue = arg;

    this.setState(
      {
        organicSource: organicSource,
        directSource: directSource,
        referralSource: referralSource,
        users: users,
        newUsers: newUsers,
        socialSource: socialSource,
        emailSource: emailSource,
        sessions: sessions,
        sourceArr: sourceArr,
        userArr: userArr,
        emailsocialArr: emailsocialArr,
      },
      () => {
        console.log(this.state.users);
      }
    );
  };

  updateDashboard = (event) => {
    this.getData(event.value);
    this.setState({ selectedValue: event.value });
  };

  componentDidMount() {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let batchRowValues = data.valueRanges[0].values;

        const rows = [];

        for (let i = 1; i < batchRowValues.length; i++) {
          let rowObject = {};
          for (let j = 0; j < batchRowValues[i].length; j++) {
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
            //console.log(batchRowValues[0][j]);
            // console.log(batchRowValues[i][j]);
          }
          rows.push(rowObject);
        }
        // dropdown options
        let dropdownOptions = [];

        for (let i = 0; i < rows.length; i++) {
          dropdownOptions.push(rows[i].month);
        }

        dropdownOptions = Array.from(new Set(dropdownOptions)).reverse();
        this.setState(
          {
            items: rows,
            dropdownOptions: dropdownOptions,
            selectedValue: "Jan 2018",
          },
          () => this.getData("Jan 2018")
        );
      });
  }

  render() {
    return (
      <div>
        <Container>
          <Row className="TopHeader">
            <Col className="TopTitle">Dashboard</Col>
            <Col>
              <Dropdown
                options={this.state.dropdownOptions}
                onChange={this.updateDashboard}
                value={this.state.selectedValue}
                placeholder="Select an option"
              />
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="mainDashboard">
            <Col>
              <WidgetText
                title="Organic Source"
                value={this.state.organicSource}
              />
            </Col>
            <Col>
              <WidgetText
                title="Direct Source"
                value={this.state.directSource}
              />
            </Col>
            <Col>
              <WidgetText
                title="Referral Source"
                value={this.state.referralSource}
              />
            </Col>
          </Row>
          <Row className="mainDashboard">
            <Col>
              <WidgetText title="Users" value={this.state.users} />
            </Col>
            <Col>
              <WidgetText title="New Users" value={this.state.newUsers} />
            </Col>
            <Col>
              <WidgetText title="New Users" value={this.state.newUsers} />
            </Col>
          </Row>
          <Row className="mainDashboard">
            <Col>
              <WidgetText title="Users" value={this.state.socialSource} />
            </Col>
            <Col>
              <WidgetText title="New Users" value={this.state.sessions} />
            </Col>
            <Col>
              <WidgetText title="New Users" value={this.state.emailSource} />
            </Col>
          </Row>
          <Row className="mainDashboard">
            <Col>
              <WidgetBar
                title="Source Comparision"
                data={this.state.sourceArr}
              />
            </Col>
            <Col>
              <WidgetDough title="User Comparision" data={this.state.userArr} />
            </Col>
            <Col>
              <WidgetPie
                title="Referral Comparision"
                data={this.state.emailsocialArr}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
