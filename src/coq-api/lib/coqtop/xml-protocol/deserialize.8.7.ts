import * as coqProto from '../coq-proto';
import {Deserialize, Node} from './deserialize.base';
import * as Nodes_8_7 from "./nodes.8.7";

export class Deserialize_8_7 extends Deserialize {
    public static readonly baseVersion = "8.6";

    // public deserializeFeedbackContent(v: Node) : any {
    //   const value = v as Nodes_8_7.FeedbackContentNode;
    //   switch (value.$kind) {
    //   default:
    //     return super.deserializeFeedbackContent(value);
    //   }
    // }

    public deserialize(v: Node): coqProto.CoqValue {
        const value = v as Nodes_8_7.TypedNode;
        try {
            switch (value.$name) {
                case 'message':
                    return {
                        level: value.$children[0],
                        location: value.$children[1],
                        message: value.$children[2],
                    } as coqProto.Message;
                case 'ltacprof':
                    return {
                        total_time: +value.$.total_time,
                        tactics: value.$children,
                    } as coqProto.LtacProfResults;
                case 'ltacprof_tactic':
                    return {
                        name: value.$.name,
                        statistics: {
                            total: +value.$.total,
                            local: +value.$.local,
                            num_calls: +value.$.ncalls,
                            max_total: +value.$.max_total
                        },
                        tactics: value.$children
                    } as coqProto.LtacProfTactic;
                default:
                    return super.deserialize(v);
            }
        } catch (err) {
            // debugger;
        }
    }
}
