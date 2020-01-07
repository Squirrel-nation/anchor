// @flow
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Button, Icon, Label, List, Segment } from 'semantic-ui-react';
import { get } from 'dot-prop-immutable';
import { attempt, isError } from 'lodash';

class PromptFragmentTransactionAction extends Component<Props> {
  render() {
    const {
      action,
      enableWhitelist,
      index,
      modifyWhitelist,
      t,
      total,
      whitelist,
    } = this.props;
    return (
      <div key={index}>
        <Segment attached="top" color="blue" inverted>
          <Label basic size="large">
            {action.account}
            <Icon
              name="caret right"
              style={{ marginLeft: '1em' }}
            />
            {action.name}
          </Label>
          <Label color="blue" size="large">
            Action {index + 1} of {total}
          </Label>
        </Segment>
        <Segment attached secondary>
          <List divided relaxed size="large">
            {Object.keys(action.data).sort().map((k) => {
              const isFlexible = get(whitelist, `flexible.${index}.${k}`, false)
              return (
                <List.Item key={k}>
                  {(enableWhitelist)
                    ? (
                      <Button
                        basic
                        color={(isFlexible) ? 'green' : 'grey'}
                        // style={{ background: 'white' }}
                        size="large"
                        floated="left"
                        icon
                        index={index}
                        name={k}
                        onClick={modifyWhitelist}
                      >
                        <Icon
                          name={(isFlexible) ? 'lock open' : 'lock'}
                        />
                      </Button>
                    )
                    : false
                  }
                  <List.Content>
                    {(!isError(attempt(JSON.parse, k)))
                      ? JSON.stringify(JSON.parse(k))
                      : String(k)
                    }
                    <List.Header
                      style={{ marginTop: '0.25em' }}
                    >
                      {(!isError(attempt(JSON.parse, action.data[k])))
                        ? JSON.stringify(JSON.parse(action.data[k]))
                        : String(action.data[k])
                      }
                    </List.Header>
                  </List.Content>
                </List.Item>
              );
            })}
          </List>
        </Segment>
        <Segment attached="bottom">
          <List>
            <List.Header>
              <Label color="white" basic pointing="left">
                Signatures Required
              </Label>
            </List.Header>
            {action.authorization.map((auth, idx) => (
              <List.Item>
                <Label color="blue" key={`${idx}@${auth.actor}@${auth.permission}`}>
                  <Icon name="pencil" />
                  {auth.actor}@{auth.permission}
                </Label>
              </List.Item>
            ))}
          </List>
        </Segment>
      </div>
    );
  }
}

export default translate('global')(PromptFragmentTransactionAction);