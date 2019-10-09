<template>
    <div>
        <card v-if="operationList && createName" class="otherFontStyle" :dis-hover="true">
            <Row type="flex" justify="center" v-show="createName">
                <Col class="otherMessageBarNameWidth">
                    <p>
                        <span>创建人：</span>
                        <span>{{createName}}</span>
                    </p>
                </Col>
                <Col class="otherMessageBarTimeWidth">
                    <p>
                        <span>创建日期：</span>
                        <span>{{createTime}}</span>
                    </p>
                </Col>
            </Row>
            <Row type="flex" justify="center" v-show="updateName">
                <Col class="otherMessageBarNameWidth">
                    <p>
                        <span>修改人：</span>
                        <span>{{updateName}}</span>
                    </p>
                </Col>
                <Col class="otherMessageBarTimeWidth">
                    <p>
                        <span>修改日期：</span>
                        <span>{{updateTime}}</span>
                    </p>
                </Col>
            </Row>
            <Row v-for="(item, index) in operationList" :key="index" type="flex" justify="center" v-show="updateName">
                <Col class="otherMessageBarNameWidth">
                    <p>
                        <span>{{ item.actionName }}人：</span>
                        <span>{{item.userName}}</span>
                    </p>
                </Col>
                <Col class="otherMessageBarTimeWidth">
                    <p>
                        <span>{{ item.actionName }}日期：</span>
                        <span>{{item.createTime}}</span>
                    </p>
                </Col>
            </Row>
        </card>
        <card v-if="!operationList && createName" class="otherFontStyle" v-else :dis-hover="true">
            <Row type="flex" justify="center" v-show="createName">
                <Col class="otherMessageBarNameWidth">
                    <p>
                        <span>创建人：</span>
                        <span>{{createName}}</span>
                    </p>
                </Col>
                <Col class="otherMessageBarTimeWidth">
                    <p>
                        <span>创建日期：</span>
                        <span>{{createTime}}</span>
                    </p>
                </Col>
            </Row>
            <Row type="flex" justify="center" v-show="updateName">
                <Col class="otherMessageBarNameWidth">
                    <p>
                        <span>修改人：</span>
                        <span>{{updateName}}</span>
                    </p>
                </Col>
                <Col class="otherMessageBarTimeWidth">
                    <p>
                        <span>修改日期：</span>
                        <span>{{updateTime}}</span>
                    </p>
                </Col>
            </Row>
            <Row type="flex" justify="center" v-show="submitName">
                <Col class="otherMessageBarNameWidth">
                    <p>
                        <span>提交人：</span>
                        <span>{{submitName}}</span>
                    </p>
                </Col>
                <Col class="otherMessageBarTimeWidth">
                    <p>
                        <span>提交日期：</span>
                        <span>{{submitTime}}</span>
                    </p>
                </Col>
            </Row>
            <Row type="flex" justify="center" v-show="auditName">
                <Col class="otherMessageBarNameWidth">
                    <p>
                        <span>审核人：</span>
                        <span>{{auditName}}</span>
                    </p>
                </Col>
                <Col class="otherMessageBarTimeWidth">
                    <p>
                        <span>审核日期：</span>
                        <span>{{auditTime}}</span>
                    </p>
                </Col>
            </Row>
            <Row type="flex" justify="center" v-show="enableName">
                <Col class="otherMessageBarNameWidth">
                    <p>
                        <span>禁用人：</span>
                        <span>{{enableName}}</span>
                    </p>
                </Col>
                <Col class="otherMessageBarTimeWidth">
                    <p>
                        <span>禁用日期：</span>
                        <span>{{enableTime}}</span>
                    </p>
                </Col>
            </Row>
            <Row type="flex" justify="center" v-show="closeName">
                <Col class="otherMessageBarNameWidth">
                    <p>
                        <span>关闭人：</span>
                        <span>{{closeName}}</span>
                    </p>
                </Col>
                <Col class="otherMessageBarTimeWidth">
                    <p>
                        <span>关闭日期：</span>
                        <span>{{closeTime}}</span>
                    </p>
                </Col>
            </Row>
        </card>
    </div>
</template>

<script>
export default {
    name: 'xw-operation-log',
    props: ['createName', 'createTime', 'updateName', 'updateTime', 'auditName', 'auditTime', 'closeName', 'closeTime', 'enableName', 'enableTime', 'submitName', 'submitTime', 'operationList']
};
</script>

<style scoped>
.xw-operation-log{
    height:32px;
    padding-left:6px;
    background: #f8f8f8;
    border-radius: 4px;
    font-size: 12px;
    color:#c5c8ce
}
</style>
