import * as postmark from "../../src/index";

import {expect} from "chai";
import "mocha";

import * as nconf from "nconf";
import BaseClient from "../../src/client/BaseClient";
import * as sinon from 'sinon';

const testingKeys = nconf.env().file({file: __dirname + "/../../testing_keys.json"});

const packageJson = require("../../package.json");
const clientVersion = packageJson.version;

describe("ServerClient", () => {
    let client: postmark.ServerClient;
    const serverToken: string = testingKeys.get("SERVER_TOKEN");

    beforeEach(() => {
        client = new postmark.ServerClient(serverToken);
    });

    describe("#new", () => {
        it("default clientOptions", () => {
            expect(client.clientOptions).to.eql({
                useHttps: true,
                requestHost: "api.postmarkapp.com",
                timeout: 30,
            });
        });

        it("clientVersion", () => {
            expect(client.clientVersion).to.equal(clientVersion);
        });
    });

    it("clientVersion=", () => {
        const customClientVersion = "test";
        client.clientVersion = customClientVersion;
        expect(client.clientVersion).to.equal(customClientVersion);
    });

    describe("clientOptions", () => {
        it("clientOptions=", () => {
            const requestHost = "test";
            const useHttps = false;
            const timeout = 10;

            client.clientOptions.requestHost = requestHost;
            client.clientOptions.useHttps = useHttps;
            client.clientOptions.timeout = timeout;

            expect(client.clientOptions).to.eql({
                useHttps,
                requestHost,
                timeout,
            });
        });

        it("new clientOptions as object", () => {
            const requestHost = "test";
            const useHttps = false;
            const timeout = 50;
            const clientOptions = new postmark.Models.ClientOptions.Configuration(useHttps, requestHost, timeout);
            client = new postmark.ServerClient(serverToken, clientOptions);

            expect(client.clientOptions).to.eql({
                useHttps,
                requestHost,
                timeout,
            });
        });

        it("new clientOptions as parameter", () => {
            const requestHost = "test";
            const useHttps = false;
            const timeout = 50;

            client = new postmark.ServerClient(serverToken, {
                useHttps,
                requestHost,
                timeout,
            });

            expect(client.clientOptions).to.eql({
                useHttps,
                requestHost,
                timeout,
            });
        });

    });

    describe("errors", () => {
        const invalidTokenError = "InvalidAPIKeyError";

        describe("handling errors", () => {
            let sandbox: sinon.SinonSandbox;

            beforeEach(() => {
                sandbox = sinon.createSandbox();
            });

            afterEach(() => {
                sandbox.restore();
            });

            it("throw basic error - promise", () => {
                sandbox.stub(BaseClient.prototype, <any> "httpRequest").throws(new Error("Basic error"))

                const serverToken: string = testingKeys.get("SERVER_TOKEN");
                let client: postmark.ServerClient = new postmark.ServerClient(serverToken);

                return client.getServer().then((result) => {
                    return result;
                }, (error) => {
                    expect(error).to.be.instanceOf(postmark.Errors.PostmarkError)
                    expect(error.message).to.equal("Basic error");
                });
            });

            it("throw api key error - promise", () => {
                let error: any = new Error("Basic error");
                error.statusCode = 401;
                sandbox.stub(BaseClient.prototype, <any> "httpRequest").throws(error)

                const serverToken: string = testingKeys.get("SERVER_TOKEN");
                let client: postmark.ServerClient = new postmark.ServerClient(serverToken);

                return client.getServer().then((result) => {
                    return result;
                }, (error) => {
                    expect(error).to.be.instanceOf(postmark.Errors.InvalidAPIKeyError);
                });
            });

            describe("http status code errors", () => {
                it("404", () => {
                    let error: any = new Error("Basic error");
                    error.statusCode = 404;
                    sandbox.stub(BaseClient.prototype, <any> "httpRequest").throws(error)

                    const serverToken: string = testingKeys.get("SERVER_TOKEN");
                    let client: postmark.ServerClient = new postmark.ServerClient(serverToken);

                    return client.getServer().then((result) => {
                        return result;
                    }, (error) => {
                        expect(error).to.be.instanceOf(postmark.Errors.PostmarkError);
                    });
                });

                it("422", () => {
                    let error: any = new Error("Basic error");
                    error.statusCode = 422;
                    sandbox.stub(BaseClient.prototype, <any> "httpRequest").throws(error)

                    const serverToken: string = testingKeys.get("SERVER_TOKEN");
                    let client: postmark.ServerClient = new postmark.ServerClient(serverToken);

                    return client.getServer().then((result) => {
                        return result;
                    }, (error) => {
                        expect(error).to.be.instanceOf(postmark.Errors.ApiInputError);
                    });
                });

                it("500", () => {
                    let error: any = new Error("Basic error");
                    error.statusCode = 500;
                    sandbox.stub(BaseClient.prototype, <any> "httpRequest").throws(error)

                    const serverToken: string = testingKeys.get("SERVER_TOKEN");
                    let client: postmark.ServerClient = new postmark.ServerClient(serverToken);

                    return client.getServer().then((result) => {
                        return result;
                    }, (error) => {
                        expect(error).to.be.instanceOf(postmark.Errors.InternalServerError);
                    });
                });

                it("503", () => {
                    let error: any = new Error("Basic error");
                    error.statusCode = 503;
                    sandbox.stub(BaseClient.prototype, <any> "httpRequest").throws(error)

                    const serverToken: string = testingKeys.get("SERVER_TOKEN");
                    let client: postmark.ServerClient = new postmark.ServerClient(serverToken);

                    return client.getServer().then((result) => {
                        return result;
                    }, (error) => {
                        expect(error).to.be.instanceOf(postmark.Errors.ServiceUnavailablerError);
                    });
                });

                it("505", () => {
                    let error: any = new Error("Basic error");
                    error.statusCode = 505;
                    sandbox.stub(BaseClient.prototype, <any> "httpRequest").throws(error)

                    const serverToken: string = testingKeys.get("SERVER_TOKEN");
                    let client: postmark.ServerClient = new postmark.ServerClient(serverToken);

                    return client.getServer().then((result) => {
                        return result;
                    }, (error) => {
                        expect(error).to.be.instanceOf(postmark.Errors.UnknownError);
                    });
                });
            });

            it("throw basic error - callback", (done) => {
                sandbox.stub(BaseClient.prototype, <any> "httpRequest").throws(new Error("Basic error"))

                const serverToken: string = testingKeys.get("SERVER_TOKEN");
                let client: postmark.ServerClient = new postmark.ServerClient(serverToken);

                client.getServer((error: any, data) => {
                    expect(data).to.equal(null);
                    expect(error.name).to.equal('PostmarkError');
                    done();
                });
            });
        });

        it("empty token", () => {
            expect(() => new postmark.ServerClient(""))
                .to.throw("A valid API token must be provided.");
        });

        it("promise error", () => {
            return client.getBounces().then((result) => {
                return result;
            }, (error) => {
                expect(error.name).to.equal(invalidTokenError);
            });
        });

        it("callback error", (done) => {
            client = new postmark.ServerClient("testToken");
            client.getBounces(undefined, (error: any, data) => {
                expect(data).to.equal(null);
                expect(error.name).to.equal(invalidTokenError);
                done();
            });
        });
    });
});
