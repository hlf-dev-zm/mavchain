import React, { Fragment } from "react";
import {
  Col,
  Row,
  Button,
  FormGroup,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
  Card,
  CardBody,
  CardTitle,
  UncontrolledButtonDropdown
} from "reactstrap";
import { Notification } from "react-pnotify";
import Loader from "react-loaders";
import axios from "axios";
import "react-alice-carousel/lib/alice-carousel.css";

export default class BlockChain extends React.Component {
  constructor() {
    super();
    this.state = {
      name1: "",
      name2: "",
      name3: "",
      hash: "",
      loader: false,
      loader1: false,
      colorofProvider: "primary",
      Hp1: "light",
      Hp2: "light",
      Hp3: "light",
      Hps: "light",
      Hp1Loaded: false,
      Hp2Loaded: false,
      Hp3Loaded: false,
      verifyhp1: "",
      verifyhp2: "",
      verifyhp3: "",
      verifystatusHp1: false,
      verifystatusHp2: false,
      verifystatusHp3: false,
      Hp1Status: "",
      partyId: "",
      chainSubmitStatus: "",
      provider: true,
      Hp2Status: "",
      chainSubmitStatus1: "",
      Hp3Status: "",
      chainSubmitStatus2: "",
      verifyQuery: "",
      completestatus: "",
      show: false,
      hashSlide: [],
      showchain: true,
      provideinput: false,
      index1: 0,
      HideHash: true,
      QuerySection: true,
      hpbutton: false,
      submittochainloader1: false,
      finalloader: false,
      queryloader: false,
      neterror: false,
      errorReason: "",
      ErrorLoader: false,
      emptyresponse1: false,
      emptyresponse2: false,
      emptyresponse3: false,
      Emptyquerymessage: "",
      emptyresponselength: "",
      emptymessageloader: ""
    };
  }

  nameChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  Submit = (e) => {
    if (
      this.state.name1.length === 0 ||
      this.state.name2.length === 0 ||
      this.state.name3.length === 0
    ) {
      this.setState({ emptymessageloader: "Please Provide Input" });
    } else {
      this.setState({
        index1: this.state.index1 + 1,
        emptymessageloader: ""
      });

      if (
        this.state.name1 !== "" ||
        this.state.name2 !== "" ||
        this.state.name3 !== ""
      ) {
        this.setState({ loader: true, hash: "" });

        if (
          this.state.name1.length > 3 &&
          this.state.name2.length > 3 &&
          this.state.name3.length > 3
        ) {
          axios
            .post(`http://34.68.112.134:9000/generateHash`, {
              info1: this.state.name1,
              info2: this.state.name2,
              info3: this.state.name3
            })
            .then(
              (response) => {
                console.log("line no 100", response);
                this.setState({ name1: "", name2: "", name3: "" });
                if (response.status === 200) {
                  console.log(response.data);
                  console.log(response.data.Reason);
                  if (response.data.Reason !== undefined) {
                    this.setState({
                      errorReason: response.data.Reason,
                      ErrorLoader: true,
                      loader: false
                    });
                  } else {
                    console.log(response.data.hash);
                    this.setState({
                      hash: response.data.hash,
                      loader: false,
                      ErrorLoader: false
                    });
                    if (this.state.hashSlide.length > 9) {
                      const newhashslide = this.state.hashSlide.shift();
                      console.log(newhashslide);
                      this.setState({ hashSlide: [...this.state.hashSlide] });
                    }

                    const id = this.state.hashSlide + 2;

                    var payload = {
                      id,
                      hash: response.data.hash,
                      ind: this.state.index1
                    };
                    this.setState({
                      hashSlide: [...this.state.hashSlide, payload]
                    });
                    sessionStorage.setItem("hash", response.data.hash);
                  }
                }
              },
              (error) => {
                console.log("line no 123");
                console.log(error);
                this.setState({ neterror: true });
              }
            );
        }
      } else {
        this.setState({ provideinput: true });
      }
    }
  };

  Hpsbutton = (e) => {
    console.log("click");
    this.setState({
      [e.target.name]: "primary",
      Hp1: "light",
      Hp2: "light",
      Hp3: "light",
      colorofProvider: "light",
      hpbutton: true
    });
  };

  colorbutton1 = (e) => {
    this.setState({
      [e.target.name]: "primary",
      Hp1: "light",
      Hp2: "light",
      Hp3: "light",
      Hp1Loaded: false,
      Hp2Loaded: false,
      Hp3Loaded: false,
      provider: true,
      show: false,
      HideHash: true,
      QuerySection: true,
      Hps: "light",
      showchain: true
    });
  };

  colorbutton2 = (e) => {
    this.setState({
      [e.target.name]: "primary",
      colorofProvider: "light",
      Hp2: "light",
      Hp3: "light",
      Hp1Loaded: true,
      Hp2Loaded: false,
      partyId: "HP1",
      show: false,
      HideHash: false,
      QuerySection: false,
      Hps: "light",
      showchain: false
    });
  };

  colorbutton3 = (e) => {
    this.setState({
      [e.target.name]: "primary",
      colorofProvider: "light",
      Hp3: "light",
      Hp1: "light",
      Hp1Loaded: false,
      Hp2Loaded: true,
      partyId: "HP2",
      show: false,
      HideHash: false,
      QuerySection: false,
      Hps: "light",
      showchain: false
    });
  };

  colorbutton4 = (e) => {
    this.setState({
      [e.target.name]: "primary",
      colorofProvider: "light",
      Hp2: "light",
      Hp1: "light",
      Hp1Loaded: false,
      Hp2Loaded: false,
      Hp3Loaded: true,
      partyId: "HP3",
      show: false,
      HideHash: false,
      QuerySection: false,
      Hps: "light",
      showchain: false
    });
  };

  Submithp1 = (e) => {
    if (this.state.verifyhp1.length === 0) {
      this.setState({ emptyresponse1: true });
    } else {
      this.setState({ loader1: true, emptyresponse1: false });
      axios
        .post(`http://34.68.112.134:9000/verifyHash`, {
          hash: this.state.verifyhp1
        })
        .then((response) => {
          this.setState({ loader1: false });
          if (response.data.status === "YES") {
            this.setState({ verifystatusHp1: true, Hp1Status: "yes" });
          } else {
            this.setState({ verifystatusHp1: true, Hp1Status: "no" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  Submithp2 = (e) => {
    if (this.state.verifyhp2.length === 0) {
      this.setState({ emptyresponse2: true });
    } else {
      this.setState({ loader1: true, emptyresponse2: false });
      axios
        .post(`http://34.68.112.134:9000/verifyHash`, {
          hash: this.state.verifyhp2
        })
        .then((response) => {
          this.setState({ loader1: false });
          if (response.data.status === "YES") {
            this.setState({ verifystatusHp2: true, Hp2Status: "yes" });
          } else {
            this.setState({ verifystatusHp2: true, Hp2Status: "no" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  Submithp3 = (e) => {
    if (this.state.verifyhp3.length === 0) {
      this.setState({ emptyresponse3: true });
    } else {
      this.setState({ loader1: true, emptyresponse3: false });
      axios
        .post(`http://34.68.112.134:9000/verifyHash`, {
          hash: this.state.verifyhp3
        })
        .then((response) => {
          this.setState({ loader1: false });
          if (response.data.status === "YES") {
            this.setState({ verifystatusHp3: true, Hp3Status: "yes" });
          } else {
            this.setState({ verifystatusHp3: true, Hp3Status: "no" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  selectChange1 = (e) => {
    this.setState({ Hp1Status: e.target.value });
  };
  selectChange2 = (e) => {
    this.setState({ Hp2Status: e.target.value });
  };
  selectChange3 = (e) => {
    this.setState({ Hp3Status: e.target.value });
  };

  Submittochain1 = (e) => {
    this.setState({ finalloader: true });
    axios
      .post(`http://34.68.112.134:9000/updateHashStatus`, {
        hash: this.state.verifyhp1,
        party_id: this.state.partyId,
        status: this.state.Hp1Status
      })
      .then((response) => {
        this.setState({ finalloader: false });
        if (response.data === true) {
          this.setState({
            chainSubmitStatus: "Successfull Submited",
            show: true,
            verifyhp1: "",
            verifystatusHp1: false
          });
        } else {
          console.log("line no 316");
          console.log(response.data.Reason);
          this.setState({
            chainSubmitStatus: response.data.Reason,
            show: true,
            verifyhp1: "",
            verifystatusHp1: false
          });
        }
      })
      .catch((error) => {
        console.log("line no 321", error);
      });
  };

  Submittochain2 = (e) => {
    this.setState({ finalloader: true });

    console.log(this.state.verifyhp2, this.state.partyId, this.state.Hp2Status);
    axios
      .post(`http://34.68.112.134:9000/updateHashStatus`, {
        hash: this.state.verifyhp2,
        party_id: this.state.partyId,
        status: this.state.Hp2Status
      })
      .then((response) => {
        console.log(response.data);
        this.setState({ finalloader: false });
        if (response.data === true) {
          this.setState({
            chainSubmitStatus1: "Successfull Submited",
            show: true,
            verifyhp2: "",
            verifystatusHp2: false
          });
        } else {
          this.setState({ chainSubmitStatus1: response.data.Reason });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  Submittochain3 = (e) => {
    this.setState({ finalloader: true });
    axios
      .post(`http://34.68.112.134:9000/updateHashStatus`, {
        hash: this.state.verifyhp3,
        party_id: this.state.partyId,
        status: this.state.Hp3Status
      })
      .then((response) => {
        this.setState({ finalloader: false });
        if (response.data === true) {
          this.setState({
            chainSubmitStatus2: "Successfull Submited",
            show: true,
            verifyhp3: "",
            verifystatusHp3: false
          });
        } else {
          this.setState({ chainSubmitStatus2: response.data.Reason });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onQuery1 = (e) => {
    console.log(this.state.onQuery);
    if (this.state.onQuery === undefined) {
      this.setState({ Emptyquerymessage: "Please Provide Hash Input" });
    } else {
      this.setState({ queryloader: true, Emptyquerymessage: "" });
      axios
        .post(`http://34.68.112.134:9000/getHashStatus`, {
          hash: this.state.onQuery
        })
        .then((response) => {
          console.log(response);
          this.setState({ queryloader: false });
          this.setState({
            completestatus: response.data.status.status,
            show: false
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  render() {
    console.log(this.state.emptymessageloader);
    return (
      <Fragment>
        {this.state.neterror && <p>Network Error</p>}

        {!this.state.neterror && (
          <>
            {this.state.provideinput && (
              <Notification
                type="success"
                title=""
                text="Please Provide Input"
                animateIn="zoomInLeft"
                animateOut="zoomOutRight"
                delay={2000}
                shadow={false}
                hide={true}
                nonblock={false}
                desktop={false}
              />
            )}
            {/* {this.state.emptymessageloader && (
              <Notification
                type="warning"
                title=""
                text="Please Provide Input"
                animateIn="zoomInLeft"
                animateOut="zoomOutRight"
                delay={2000}
                shadow={false}
                hide={true}
                nonblock={false}
                desktop={false}
              />
            )} */}

            {this.state.ErrorLoader && (
              <Notification
                type="Error"
                title=""
                text={this.state.errorReason}
                animateIn="zoomInLeft"
                animateOut="zoomOutRight"
                delay={2000}
                shadow={false}
                hide={true}
                nonblock={false}
                desktop={false}
              />
            )}

            <Row>
              <Col lg="12">
                <div className="" style={{ marginTop: "6%" }}>
                  <Row>
                    <Col md="6" className="mx-auto app-login-box">
                      <div className="" />
                      <div className="modal-dialog w-100">
                        <div className="modal-content">
                          <div
                            className="modal-body"
                            style={{ backgroundColor: "#659DBD" }}
                          >
                            <div>
                              <Button
                                className="mb-2 mr-2 btn-pill"
                                name="colorofProvider"
                                color={this.state.colorofProvider}
                                onClick={this.colorbutton1}
                              >
                                Provider
                              </Button>

                              <UncontrolledButtonDropdown>
                                <DropdownToggle
                                  caret
                                  className="mb-2 mr-2 btn-pill"
                                  name="Hps"
                                  color={this.state.Hps}
                                  onClick={this.Hpsbutton}
                                >
                                  HPs
                                </DropdownToggle>
                                <DropdownMenu>
                                  <div className="dropdown-menu-header">
                                    <div className="dropdown-menu-header-inner bg-success">
                                      <div className="menu-header-content text-left">
                                        <h6 className="menu-header-subtitle">
                                          Select Hp
                                        </h6>
                                      </div>
                                    </div>
                                  </div>
                                  <DropdownItem
                                    name="Hp1"
                                    color={this.state.Hp1}
                                    onClick={this.colorbutton2}
                                  >
                                    Hp1
                                  </DropdownItem>

                                  <DropdownItem
                                    name="Hp2"
                                    color={this.state.Hp2}
                                    onClick={this.colorbutton3}
                                  >
                                    Hp2
                                  </DropdownItem>
                                  <DropdownItem
                                    name="Hp3"
                                    color={this.state.Hp3}
                                    onClick={this.colorbutton4}
                                  >
                                    Hp3
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledButtonDropdown>
                            </div>

                            <Row className="divider" />

                            {!this.state.Hp2Loaded &&
                              !this.state.Hp1Loaded &&
                              this.state.Hp3Loaded && (
                                <>
                                  <Col md={12}>
                                    <FormGroup>
                                      <center>
                                        <h5 style={{ color: "white" }}>HP3</h5>
                                      </center>
                                      <Input
                                        type="text"
                                        style={{ backgroundColor: "" }}
                                        name="verifyhp3"
                                        value={this.state.verifyhp3}
                                        onChange={this.nameChange}
                                        placeholder="Check Patient"
                                      />
                                      <p style={{ color: "white" }}>
                                        Provide Hash value to verify from block
                                        chain Record
                                      </p>
                                    </FormGroup>

                                    <center>
                                      <Button
                                        className="mb-2 mr-2 btn-pill"
                                        color="primary"
                                        size="lg"
                                        onClick={this.Submithp3}
                                      >
                                        Select Response
                                      </Button>
                                    </center>
                                  </Col>
                                  {this.state.loader1 && (
                                    <>
                                      <center>
                                        <Loader type="square-spin" />
                                      </center>
                                    </>
                                  )}

                                  {this.state.emptyresponse3 && (
                                    <p style={{ color: "red" }}>
                                      Please provide Hash value
                                    </p>
                                  )}

                                  {this.state.verifystatusHp3 && (
                                    <>
                                      <Input
                                        type="select"
                                        onChange={this.selectChange3}
                                        bsSize="sm"
                                        style={{ width: "50%" }}
                                      >
                                        {this.state.Hp3Status === "yes" && (
                                          <>
                                            <option value="yes">YES </option>
                                            <option value="no">NO</option>
                                          </>
                                        )}
                                        {this.state.Hp3Status === "no" && (
                                          <>
                                            <option value="no">NO </option>
                                            <option value="yes">Yes</option>
                                          </>
                                        )}
                                      </Input>
                                      <br />
                                      <center>
                                        <Button
                                          className="mb-2 mr-2 btn-pill"
                                          color="primary"
                                          size="lg"
                                          onClick={this.Submittochain3}
                                        >
                                          Submit to Chain
                                        </Button>
                                      </center>
                                    </>
                                  )}

                                  {this.state.finalloader && (
                                    <center>
                                      <Loader type="ball-pulse" />
                                    </center>
                                  )}

                                  {this.state.show && (
                                    <Notification
                                      type="success"
                                      title="Successfull"
                                      text="Successfully Submited"
                                      animateIn="zoomInLeft"
                                      animateOut="zoomOutRight"
                                      delay={2000}
                                      shadow={false}
                                      hide={true}
                                      nonblock={false}
                                      desktop={false}
                                    />
                                  )}
                                </>
                              )}

                            {this.state.Hp2Loaded && !this.state.Hp1Loaded && (
                              <>
                                <Col md={12}>
                                  <FormGroup>
                                    <center>
                                      <h5 style={{ color: "white" }}>HP2</h5>
                                    </center>
                                    <Input
                                      type="text"
                                      name="verifyhp2"
                                      value={this.state.verifyhp2}
                                      onChange={this.nameChange}
                                      placeholder="Check Patient"
                                    />
                                    <p style={{ color: "white" }}>
                                      Provide Hash value to verify from block
                                      chain Record
                                    </p>
                                  </FormGroup>

                                  <center>
                                    <Button
                                      className="mb-2 mr-2 btn-pill"
                                      color="primary"
                                      size="lg"
                                      onClick={this.Submithp2}
                                    >
                                      Select Response
                                    </Button>
                                  </center>
                                </Col>
                                {this.state.loader1 && (
                                  <>
                                    <center>
                                      <Loader type="square-spin" />
                                    </center>
                                  </>
                                )}

                                {this.state.emptyresponse2 && (
                                  <p style={{ color: "red" }}>
                                    Please provide Hash value
                                  </p>
                                )}

                                {this.state.verifystatusHp2 && (
                                  <>
                                    <Input
                                      type="select"
                                      onChange={this.selectChange2}
                                      bsSize="sm"
                                      style={{ width: "50%" }}
                                    >
                                      {this.state.Hp2Status === "yes" && (
                                        <>
                                          <option value="yes">YES </option>
                                          <option value="no">NO</option>
                                        </>
                                      )}

                                      {this.state.Hp2Status === "no" && (
                                        <>
                                          <option value="no">NO </option>
                                          <option value="yes">Yes</option>
                                        </>
                                      )}
                                    </Input>
                                    <br />
                                    <center>
                                      <Button
                                        className="mb-2 mr-2 btn-pill"
                                        color="primary"
                                        size="lg"
                                        onClick={this.Submittochain2}
                                      >
                                        Submit to Chain
                                      </Button>
                                    </center>
                                  </>
                                )}
                                {this.state.finalloader && (
                                  <center>
                                    <Loader type="ball-pulse" />
                                  </center>
                                )}

                                {this.state.show && (
                                  <Notification
                                    type="success"
                                    title="Successfull"
                                    text="Successfully Submited"
                                    animateIn="zoomInLeft"
                                    animateOut="zoomOutRight"
                                    delay={2000}
                                    shadow={false}
                                    hide={true}
                                    nonblock={false}
                                    desktop={false}
                                  />
                                )}
                              </>
                            )}

                            {!(
                              this.state.Hp1Loaded ||
                              this.state.Hp2Loaded ||
                              this.state.Hp3Loaded
                            ) && (
                              <>
                                <Row form>
                                  <Col md={12}>
                                    <FormGroup>
                                      <Input
                                        type="text"
                                        name="name1"
                                        value={this.state.name1}
                                        onChange={this.nameChange}
                                        placeholder="Full Name"
                                      />

                                      {this.state.name1.length < 4 &&
                                        this.state.name1.length !== 0 && (
                                          <p style={{ color: "red" }}>
                                            Minimum 4 character is required
                                          </p>
                                        )}
                                    </FormGroup>
                                  </Col>
                                  <Col md={12}>
                                    <FormGroup>
                                      <Input
                                        type="date"
                                        name="name2"
                                        value={this.state.name2}
                                        onChange={this.nameChange}
                                        placeholder="Date of Birth"
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md={12}>
                                    <Input
                                      type="number"
                                      name="name3"
                                      value={this.state.name3}
                                      onChange={this.nameChange}
                                      placeholder="Last 4 digits of SSN"
                                    />

                                    {this.state.name3.length === 4 ||
                                      (this.state.name3.length !== 0 && (
                                        <p style={{ color: "red" }}>
                                          4 Digits are required
                                        </p>
                                      ))}
                                  </Col>
                                </Row>
                                <br />
                                <center>
                                  <Button
                                    className="mb-2 mr-2 btn-pill"
                                    color="primary"
                                    size="lg"
                                    onClick={this.Submit}
                                  >
                                    Submit
                                  </Button>

                                  <h6 style={{ color: "red" }}>
                                    {this.state.emptymessageloader}
                                  </h6>
                                </center>
                              </>
                            )}

                            {this.state.Hp1Loaded && (
                              <>
                                <Col md={12}>
                                  <FormGroup>
                                    <center>
                                      <h5 style={{ color: "white" }}>HP1</h5>
                                    </center>
                                    <Input
                                      type="text"
                                      name="verifyhp1"
                                      value={this.state.verifyhp1}
                                      onChange={this.nameChange}
                                      placeholder="Check Patient"
                                    />
                                    <p style={{ color: "white" }}>
                                      Provide Hash value to verify from block
                                      chain Record
                                    </p>
                                  </FormGroup>

                                  <center>
                                    <Button
                                      className="mb-2 mr-2 btn-pill"
                                      color="primary"
                                      size="lg"
                                      onClick={this.Submithp1}
                                    >
                                      Select Response
                                    </Button>
                                  </center>
                                  {this.state.loader1 && (
                                    <>
                                      <center>
                                        <Loader type="square-spin" />
                                      </center>
                                    </>
                                  )}

                                  {this.state.emptyresponse1 && (
                                    <p style={{ color: "red" }}>
                                      Please provide Hash value
                                    </p>
                                  )}

                                  {this.state.verifystatusHp1 && (
                                    <>
                                      <Input
                                        type="select"
                                        onChange={this.selectChange1}
                                        bsSize="sm"
                                        style={{ width: "50%" }}
                                      >
                                        {this.state.Hp1Status === "yes" && (
                                          <>
                                            <option value="yes">YES </option>
                                            <option value="no">NO</option>
                                          </>
                                        )}

                                        {this.state.Hp1Status === "no" && (
                                          <>
                                            <option value="no">NO </option>
                                            <option value="yes">Yes</option>
                                          </>
                                        )}
                                      </Input>
                                      <br />
                                      <center>
                                        <Button
                                          className="mb-2 mr-2 btn-pill"
                                          color="primary"
                                          size="lg"
                                          onClick={this.Submittochain1}
                                        >
                                          Submit to Chain
                                        </Button>
                                      </center>
                                    </>
                                  )}

                                  {this.state.finalloader && (
                                    <center>
                                      <Loader type="ball-pulse" />
                                    </center>
                                  )}

                                  {this.state.show && (
                                    <Notification
                                      type="success"
                                      title="Successfull"
                                      text="Successfully Submited"
                                      animateIn="zoomInLeft"
                                      animateOut="zoomOutRight"
                                      delay={2000}
                                      shadow={false}
                                      hide={true}
                                      nonblock={false}
                                      desktop={false}
                                    />
                                  )}
                                  <br />
                                </Col>
                              </>
                            )}
                          </div>
                          {this.state.HideHash && (
                            <>
                              <div
                                className="modal-footer d-block text-center"
                                style={{ backgroundColor: "#659DBD" }}
                              >
                                <br />
                                <FormGroup>
                                  <Card
                                    className="mb-3"
                                    style={{ backgroundColor: "" }}
                                  >
                                    <CardBody>
                                      <CardTitle>
                                        <p style={{ color: "black" }}>
                                          HASHED VALUE
                                        </p>
                                      </CardTitle>
                                      <p style={{ color: "black" }}>
                                        {this.state.hash}
                                      </p>
                                      {this.state.loader && (
                                        <>
                                          <center>
                                            <Loader
                                              type="square-spin"
                                              style={{ color: "#cc0000" }}
                                            />
                                          </center>
                                        </>
                                      )}
                                    </CardBody>
                                  </Card>
                                </FormGroup>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col md="6" className="mx-auto app-login-box">
                      {this.state.QuerySection && (
                        <>
                          <div className="" />
                          <div className="modal-dialog w-100">
                            <div className="modal-content">
                              <div
                                className="modal-body"
                                style={{ backgroundColor: "#659DBD" }}
                              >
                                <Row>
                                  <Col md={12}>
                                    <FormGroup>
                                      <Input
                                        type="text"
                                        name="onQuery"
                                        value={this.state.onQuery}
                                        onChange={this.nameChange}
                                        placeholder="Query Hash"
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md={12}>
                                    <FormGroup>
                                      <center>
                                        <Button
                                          className="mb-2 mr-2 btn-pill"
                                          color="primary"
                                          onClick={this.onQuery1}
                                        >
                                          Query
                                        </Button>

                                        <h6 style={{ color: "red" }}>
                                          {this.state.Emptyquerymessage}
                                        </h6>
                                      </center>

                                      {this.state.queryloader && (
                                        <center>
                                          <Loader type="ball-pulse" />
                                        </center>
                                      )}
                                    </FormGroup>
                                  </Col>
                                  <Col md={12}>
                                    <FormGroup>
                                      <Card
                                        className="mb-3"
                                        style={{ backgroundColor: "" }}
                                      >
                                        <CardBody>
                                          <CardTitle>QueryResult</CardTitle>

                                          <p>
                                            HP1: {this.state.completestatus.HP1}
                                          </p>
                                          <p>
                                            HP2: {this.state.completestatus.HP2}
                                          </p>
                                          <p>
                                            HP3: {this.state.completestatus.HP3}
                                          </p>
                                        </CardBody>
                                      </Card>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                  {this.state.showchain && (
                    <div className="staticcontainer">
                      <Row>
                        {this.state.hashSlide.map((message, index) => {
                          return (
                            <div key={index}>
                              <center>
                                <div className="w3-animate-right">
                                  <div className="simplecard">
                                    <center>
                                      <p style={{ color: "white" }}>
                                        #{message.ind}
                                      </p>
                                    </center>
                                    <p style={{ color: "white" }}>
                                      {message.hash.slice(0, 8)}..
                                    </p>
                                  </div>
                                </div>
                              </center>
                            </div>
                          );
                        })}
                      </Row>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </>
        )}
      </Fragment>
    );
  }
}
