export class NeuralNetwork {
    private layers: Layer[];
    private config: NetworkConfig;

    constructor(config: NetworkConfig) {
        this.config = config;
        this.initializeLayers();
    }

    private initializeLayers(): void {
        this.layers = [
            new InputLayer(this.config.inputNodes),
            ...this.createHiddenLayers(),
            new OutputLayer(this.config.outputNodes)
        ];
    }

    private createHiddenLayers(): Layer[] {
        return this.config.hiddenLayers.map(nodes => 
            new HiddenLayer(nodes)
        );
    }

    async forward(input: number[]): Promise<number[]> {
        let current = input;
        for (const layer of this.layers) {
            current = await layer.process(current);
        }
        return current;
    }

    async train(data: TrainingData[]): Promise<void> {
        for (const sample of data) {
            await this.trainSample(sample);
        }
    }

    async optimize(): Promise<void> {
        for (const layer of this.layers) {
            await layer.optimize();
        }
    }
}
interface NetworkConfig {
    inputNodes: number;
    hiddenLayers: number[];
    outputNodes: number;
    learningRate: number;
}

interface Layer {
    process(input: number[]): Promise<number[]>;
    optimize(): Promise<void>;
}

class InputLayer implements Layer {
    constructor(private nodes: number) {}

    async process(input: number[]): Promise<number[]> {
        return input;
    }

    async optimize(): Promise<void> {
        // Input layer optimization
    }
}
class HiddenLayer implements Layer {
    private weights: number[][];
    private biases: number[];

    constructor(private nodes: number) {
        this.initializeWeights();
        this.initializeBiases();
    }

    private initializeWeights(): void {
        this.weights = Array(this.nodes).fill(0)
            .map(() => Array(this.nodes).fill(0)
            .map(() => Math.random() - 0.5));
    }

    private initializeBiases(): void {
        this.biases = Array(this.nodes).fill(0)
            .map(() => Math.random() - 0.5);
    }

    async process(input: number[]): Promise<number[]> {
        return input.map((value, i) => 
            this.activate(
                input.reduce((sum, val, j) => 
                    sum + val * this.weights[i][j], 0) 
                + this.biases[i]
            )
        );
    }

    private activate(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    async optimize(): Promise<void> {
        // Hidden layer optimization
    }
}
class OutputLayer implements Layer {
    private weights: number[][];
    private biases: number[];

    constructor(private nodes: number) {
        this.initializeWeights();
        this.initializeBiases();
    }

    private initializeWeights(): void {
        this.weights = Array(this.nodes).fill(0)
            .map(() => Array(this.nodes).fill(0)
            .map(() => Math.random() - 0.5));
    }

    private initializeBiases(): void {
        this.biases = Array(this.nodes).fill(0)
            .map(() => Math.random() - 0.5);
    }

    async process(input: number[]): Promise<number[]> {
        return input.map((value, i) => 
            this.activate(
                input.reduce((sum, val, j) => 
                    sum + val * this.weights[i][j], 0)
                + this.biases[i]
            )
        );
    }

    private activate(x: number): number {
        return Math.max(0, x); // ReLU activation
    }

    async optimize(): Promise<void> {
        // Output layer optimization
    }
}
interface TrainingData {
    input: number[];
    expected: number[];
}

interface OptimizationResult {
    error: number;
    gradients: number[];
}

class Optimizer {
    constructor(private learningRate: number) {}

    optimize(layer: Layer, gradients: number[]): void {
        // Gradient descent optimization
        for (let i = 0; i < gradients.length; i++) {
            gradients[i] *= this.learningRate;
        }
    }

    calculateError(output: number[], expected: number[]): number {
        return output.reduce((sum, val, i) => 
            sum + Math.pow(val - expected[i], 2), 0) / output.length;
    }
}
private async trainSample(sample: TrainingData): Promise<void> {
    // Forward pass
    const layerOutputs: number[][] = [];
    let current = sample.input;
    
    for (const layer of this.layers) {
        current = await layer.process(current);
        layerOutputs.push(current);
    }

    // Backward pass
    const optimizer = new Optimizer(this.config.learningRate);
    let gradients = this.calculateOutputGradients(
        layerOutputs[layerOutputs.length - 1],
        sample.expected
    );

    for (let i = this.layers.length - 1; i >= 0; i--) {
        optimizer.optimize(this.layers[i], gradients);
        gradients = this.calculateLayerGradients(
            layerOutputs[i],
            gradients,
            this.layers[i]
        );
    }
}
private calculateOutputGradients(output: number[], expected: number[]): number[] {
    return output.map((value, i) => {
        const error = expected[i] - value;
        return error * this.derivativeReLU(value);
    });
}

private calculateLayerGradients(
    layerOutput: number[], 
    nextGradients: number[], 
    layer: Layer
): number[] {
    return layerOutput.map((value, i) => {
        const sum = nextGradients.reduce((acc, grad, j) => 
            acc + grad * (layer as any).weights[j][i], 0);
        return sum * this.derivativeSigmoid(value);
    });
}

private derivativeReLU(x: number): number {
    return x > 0 ? 1 : 0;
}

private derivativeSigmoid(x: number): number {
    return x * (1 - x);
}
async trainNetwork(epochs: number, trainingData: TrainingData[]): Promise<void> {
    for (let epoch = 0; epoch < epochs; epoch++) {
        let totalError = 0;
        
        for (const sample of trainingData) {
            await this.trainSample(sample);
            const output = await this.forward(sample.input);
            totalError += this.calculateError(output, sample.expected);
        }

        const averageError = totalError / trainingData.length;
        if (epoch % 100 === 0) {
            console.log(`Epoch ${epoch}: Average Error = ${averageError}`);
        }
    }
}

private calculateError(output: number[], expected: number[]): number {
    return output.reduce((sum, val, i) => 
        sum + Math.pow(val - expected[i], 2), 0) / output.length;
}
async predict(input: number[]): Promise<number[]> {
    const output = await this.forward(input);
    return this.normalizeOutput(output);
}

private normalizeOutput(output: number[]): number[] {
    const sum = output.reduce((acc, val) => acc + val, 0);
    return output.map(val => val / sum);
}

async predictBatch(inputs: number[][]): Promise<number[][]> {
    const predictions: number[][] = [];
    for (const input of inputs) {
        predictions.push(await this.predict(input));
    }
    return predictions;
}
async evaluate(testData: TrainingData[]): Promise<EvaluationMetrics> {
    const metrics = {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0
    };

    const predictions = await this.predictBatch(testData.map(d => d.input));
    const actual = testData.map(d => d.expected);

    metrics.accuracy = this.calculateAccuracy(predictions, actual);
    metrics.precision = this.calculatePrecision(predictions, actual);
    metrics.recall = this.calculateRecall(predictions, actual);
    metrics.f1Score = this.calculateF1Score(metrics.precision, metrics.recall);

    return metrics;
}
private calculateAccuracy(predictions: number[][], actual: number[][]): number {
    let correct = 0;
    let total = 0;
    
    for (let i = 0; i < predictions.length; i++) {
        for (let j = 0; j < predictions[i].length; j++) {
            if (Math.abs(predictions[i][j] - actual[i][j]) < 0.1) {
                correct++;
            }
            total++;
        }
    }
    
    return correct / total;
}

private calculatePrecision(predictions: number[][], actual: number[][]): number {
    let truePositives = 0;
    let falsePositives = 0;
    
    for (let i = 0; i < predictions.length; i++) {
        for (let j = 0; j < predictions[i].length; j++) {
            if (predictions[i][j] >= 0.5 && actual[i][j] >= 0.5) {
                truePositives++;
            } else if (predictions[i][j] >= 0.5 && actual[i][j] < 0.5) {
                falsePositives++;
            }
        }
    }
    
    return truePositives / (truePositives + falsePositives);
}
private calculateRecall(predictions: number[][], actual: number[][]): number {
    let truePositives = 0;
    let falseNegatives = 0;
    
    for (let i = 0; i < predictions.length; i++) {
        for (let j = 0; j < predictions[i].length; j++) {
            if (predictions[i][j] >= 0.5 && actual[i][j] >= 0.5) {
                truePositives++;
            } else if (predictions[i][j] < 0.5 && actual[i][j] >= 0.5) {
                falseNegatives++;
            }
        }
    }
    
    return truePositives / (truePositives + falseNegatives);
}

private calculateF1Score(precision: number, recall: number): number {
    return 2 * (precision * recall) / (precision + recall);
}
async saveModel(path: string): Promise<void> {
    const modelState = {
        config: this.config,
        layers: this.layers.map(layer => ({
            weights: (layer as any).weights,
            biases: (layer as any).biases,
            type: layer.constructor.name
        }))
    };
    
    const serialized = JSON.stringify(modelState);
    await this.saveToFile(path, serialized);
}

async loadModel(path: string): Promise<void> {
    const serialized = await this.loadFromFile(path);
    const modelState = JSON.parse(serialized);
    
    this.config = modelState.config;
    this.initializeFromState(modelState.layers);
}
private async saveToFile(path: string, data: string): Promise<void> {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);
    
    const buffer = new ArrayBuffer(encoded.length);
    const view = new Uint8Array(buffer);
    view.set(encoded);
    
    await this.writeBuffer(path, buffer);
}

private async loadFromFile(path: string): Promise<string> {
    const buffer = await this.readBuffer(path);
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
}
private async writeBuffer(path: string, buffer: ArrayBuffer): Promise<void> {
    const fs = await import('fs/promises');
    await fs.writeFile(path, Buffer.from(buffer));
}

private async readBuffer(path: string): Promise<ArrayBuffer> {
    const fs = await import('fs/promises');
    const data = await fs.readFile(path);
    return data.buffer;
}

private initializeFromState(layerStates: any[]): void {
    this.layers = layerStates.map(state => {
        const layer = this.createLayer(state.type, state.weights.length);
        (layer as any).weights = state.weights;
        (layer as any).biases = state.biases;
        return layer;
    });
}
private createLayer(type: string, nodes: number): Layer {
    switch (type) {
        case 'InputLayer':
            return new InputLayer(nodes);
        case 'HiddenLayer':
            return new HiddenLayer(nodes);
        case 'OutputLayer':
            return new OutputLayer(nodes);
        default:
            throw new Error(`Unknown layer type: ${type}`);
    }
}

private validateModel(): void {
    if (!this.layers || this.layers.length < 2) {
        throw new Error('Invalid model structure');
    }
}
private async optimizeModel(): Promise<void> {
    const optimizer = new Optimizer(this.config.learningRate);
    
    for (const layer of this.layers) {
        await this.optimizeLayer(layer, optimizer);
    }
}

private async optimizeLayer(layer: Layer, optimizer: Optimizer): Promise<void> {
    const weights = (layer as any).weights;
    const biases = (layer as any).biases;
    
    if (weights && biases) {
        await this.optimizeWeights(weights, optimizer);
        await this.optimizeBiases(biases, optimizer);
    }
}
private async optimizeWeights(weights: number[][], optimizer: Optimizer): Promise<void> {
    for (let i = 0; i < weights.length; i++) {
        for (let j = 0; j < weights[i].length; j++) {
            const gradient = this.calculateWeightGradient(weights[i][j]);
            weights[i][j] += optimizer.calculateUpdate(gradient);
        }
    }
}

private async optimizeBiases(biases: number[], optimizer: Optimizer): Promise<void> {
    for (let i = 0; i < biases.length; i++) {
        const gradient = this.calculateBiasGradient(biases[i]);
        biases[i] += optimizer.calculateUpdate(gradient);
    }
}
private calculateWeightGradient(weight: number): number {
    const momentum = 0.9;
    const regularization = 0.0001;
    return -weight * regularization * momentum;
}

private calculateBiasGradient(bias: number): number {
    const momentum = 0.9;
    return -bias * momentum;
}

private calculateLayerGradients(layer: Layer): number[] {
    const activations = (layer as any).getActivations();
    return activations.map(a => this.derivativeSigmoid(a));
}
private validateModelStructure(): void {
    this.validateLayerConnections();
    this.validateWeightDimensions();
    this.validateActivationFunctions();
}

private validateLayerConnections(): void {
    for (let i = 0; i < this.layers.length - 1; i++) {
        const currentLayer = this.layers[i];
        const nextLayer = this.layers[i + 1];
        this.validateLayerConnection(currentLayer, nextLayer);
    }
}

private validateLayerConnection(currentLayer: Layer, nextLayer: Layer): void {
    const outputSize = (currentLayer as any).nodes;
    const inputSize = (nextLayer as any).nodes;
    if (outputSize !== inputSize) {
        throw new Error(`Layer size mismatch: ${outputSize} -> ${inputSize}`);
    }
}
private validateWeightDimensions(): void {
    for (const layer of this.layers) {
        if (layer instanceof HiddenLayer || layer instanceof OutputLayer) {
            this.validateLayerWeights(layer);
            this.validateLayerBiases(layer);
        }
    }
}

private validateLayerWeights(layer: HiddenLayer | OutputLayer): void {
    const weights = (layer as any).weights;
    const expectedShape = [layer.nodes, (this.layers[0] as any).nodes];
    
    if (!this.hasCorrectShape(weights, expectedShape)) {
        throw new Error(`Invalid weight matrix shape for ${layer.constructor.name}`);
    }
}

private validateLayerBiases(layer: HiddenLayer | OutputLayer): void {
    const biases = (layer as any).biases;
    if (biases.length !== layer.nodes) {
        throw new Error(`Invalid bias vector length for ${layer.constructor.name}`);
    }
}
private hasCorrectShape(matrix: number[][], expectedShape: number[]): boolean {
    if (!matrix || !matrix.length) return false;
    if (matrix.length !== expectedShape[0]) return false;
    
    for (const row of matrix) {
        if (row.length !== expectedShape[1]) return false;
    }
    
    return true;
}

private validateActivationFunctions(): void {
    for (const layer of this.layers) {
        if (!this.hasValidActivation(layer)) {
            throw new Error(`Missing activation function in ${layer.constructor.name}`);
        }
    }
}
private hasValidActivation(layer: Layer): boolean {
    return (layer as any).activate !== undefined && 
           typeof (layer as any).activate === 'function';
}

private validateModelParameters(): void {
    this.validateLearningRate();
    this.validateBatchSize();
    this.validateEpochs();
}

private validateLearningRate(): void {
    if (this.config.learningRate <= 0 || this.config.learningRate > 1) {
        throw new Error('Learning rate must be between 0 and 1');
    }
}
private validateBatchSize(): void {
    const batchSize = this.config.batchSize || 32;
    if (batchSize < 1) {
        throw new Error('Batch size must be at least 1');
    }
}

private validateEpochs(): void {
    const epochs = this.config.epochs || 100;
    if (epochs < 1) {
        throw new Error('Number of epochs must be at least 1');
    }
}

private validateTrainingData(data: TrainingData[]): void {
    if (!data || !data.length) {
        throw new Error('Training data cannot be empty');
    }
}
private trackPerformance(): void {
    this.metrics = {
        trainingLoss: [],
        validationLoss: [],
        accuracy: [],
        learningCurve: []
    };
}

private updateMetrics(epoch: number, trainLoss: number, valLoss: number): void {
    this.metrics.trainingLoss.push(trainLoss);
    this.metrics.validationLoss.push(valLoss);
    this.metrics.accuracy.push(this.calculateAccuracy());
    this.metrics.learningCurve.push({
        epoch,
        loss: trainLoss,
        accuracy: this.metrics.accuracy[this.metrics.accuracy.length - 1]
    });
}
private visualizePerformance(): void {
    this.plotLearningCurve();
    this.plotLossHistory();
    this.plotAccuracyHistory();
}

private plotLearningCurve(): void {
    const data = this.metrics.learningCurve.map(point => ({
        x: point.epoch,
        y: point.loss,
        accuracy: point.accuracy
    }));
    
    this.createPlot({
        data,
        xLabel: 'Epochs',
        yLabel: 'Loss',
        title: 'Learning Curve'
    });
}
private createPlot(config: PlotConfig): void {
    const plotData = {
        labels: config.data.map(d => d.x),
        datasets: [{
            label: config.title,
            data: config.data.map(d => d.y),
            borderColor: '#3498db',
            fill: false
        }]
    };

    const options = {
        scales: {
            x: { title: { display: true, text: config.xLabel } },
            y: { title: { display: true, text: config.yLabel } }
        },
        responsive: true,
        maintainAspectRatio: false
    };
}
private plotLossHistory(): void {
    const data = {
        training: this.metrics.trainingLoss,
        validation: this.metrics.validationLoss
    };
    
    this.createMultiLinePlot({
        data,
        xLabel: 'Epochs',
        yLabel: 'Loss',
        title: 'Training vs Validation Loss',
        colors: ['#2ecc71', '#e74c3c']
    });
}

private plotAccuracyHistory(): void {
    this.createPlot({
        data: this.metrics.accuracy.map((acc, epoch) => ({
            x: epoch,
            y: acc
        })),
        xLabel: 'Epochs',
        yLabel: 'Accuracy',
        title: 'Model Accuracy'
    });
}
private createMultiLinePlot(config: MultiPlotConfig): void {
    const plotData = {
        labels: Object.values(config.data)[0].map((_, i) => i),
        datasets: Object.entries(config.data).map(([key, values], i) => ({
            label: key,
            data: values,
            borderColor: config.colors[i],
            fill: false
        }))
    };

    const options = {
        scales: {
            x: { title: { display: true, text: config.xLabel } },
            y: { title: { display: true, text: config.yLabel } }
        },
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false }
    };
}
private exportModel(): ModelExport {
    return {
        architecture: this.exportArchitecture(),
        weights: this.exportWeights(),
        config: this.config,
        metrics: this.metrics,
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            performance: this.getPerformanceMetrics()
        }
    };
}

private exportArchitecture(): LayerConfig[] {
    return this.layers.map(layer => ({
        type: layer.constructor.name,
        nodes: (layer as any).nodes,
        activation: (layer as any).activate.name
    }));
}
private exportWeights(): LayerWeights[] {
    return this.layers.map(layer => {
        if (layer instanceof HiddenLayer || layer instanceof OutputLayer) {
            return {
                weights: (layer as any).weights,
                biases: (layer as any).biases,
                gradients: this.calculateLayerGradients(layer)
            };
        }
        return null;
    }).filter(Boolean);
}

private getPerformanceMetrics(): PerformanceMetrics {
    return {
        finalAccuracy: this.metrics.accuracy[this.metrics.accuracy.length - 1],
        finalLoss: this.metrics.trainingLoss[this.metrics.trainingLoss.length - 1],
        trainingTime: this.calculateTrainingTime(),
        parameters: this.countParameters()
    };
}
private countParameters(): ParameterCount {
    return {
        total: this.calculateTotalParameters(),
        trainable: this.calculateTrainableParameters(),
        layerwise: this.calculateLayerwiseParameters()
    };
}

private calculateTotalParameters(): number {
    return this.layers.reduce((total, layer) => {
        if (layer instanceof HiddenLayer || layer instanceof OutputLayer) {
            const weights = (layer as any).weights.flat().length;
            const biases = (layer as any).biases.length;
            return total + weights + biases;
        }
        return total;
    }, 0);
}
private calculateTrainableParameters(): number {
    return this.layers.reduce((total, layer) => {
        if (layer instanceof HiddenLayer || layer instanceof OutputLayer) {
            const weights = (layer as any).weights.flat().length;
            const biases = (layer as any).biases.length;
            return total + weights + biases;
        }
        return total;
    }, 0);
}

private calculateLayerwiseParameters(): LayerParameters[] {
    return this.layers.map(layer => {
        if (layer instanceof HiddenLayer || layer instanceof OutputLayer) {
            return {
                name: layer.constructor.name,
                weights: (layer as any).weights.flat().length,
                biases: (layer as any).biases.length
            };
        }
        return null;
    }).filter(Boolean);
}
private calculateTrainingTime(): TrainingTime {
    return {
        total: this.endTime - this.startTime,
        perEpoch: (this.endTime - this.startTime) / this.config.epochs,
        perBatch: this.calculateAverageBatchTime()
    };
}

private calculateAverageBatchTime(): number {
    const totalBatches = this.batchTimes.length;
    const totalTime = this.batchTimes.reduce((sum, time) => sum + time, 0);
    return totalTime / totalBatches;
}
private createCheckpoint(): ModelCheckpoint {
    return {
        timestamp: new Date().toISOString(),
        epoch: this.currentEpoch,
        metrics: {
            loss: this.metrics.trainingLoss[this.currentEpoch],
            accuracy: this.metrics.accuracy[this.currentEpoch]
        },
        weights: this.exportWeights(),
        gradients: this.calculateGradients()
    };
}

private saveCheckpoint(checkpoint: ModelCheckpoint): void {
    this.checkpoints.push(checkpoint);
    if (this.checkpoints.length > this.config.maxCheckpoints) {
        this.checkpoints.shift();
    }
}
private calculateGradients(): LayerGradients[] {
    return this.layers.map(layer => {
        if (layer instanceof HiddenLayer || layer instanceof OutputLayer) {
            return {
                weightGradients: this.calculateWeightGradients(layer),
                biasGradients: this.calculateBiasGradients(layer),
                activationGradients: this.calculateActivationGradients(layer)
            };
        }
        return null;
    }).filter(Boolean);
}

private calculateWeightGradients(layer: Layer): number[][] {
    const weights = (layer as any).weights;
    return weights.map(row => 
        row.map(weight => this.calculateWeightGradient(weight))
    );
}
private calculateBiasGradients(layer: Layer): number[] {
    const biases = (layer as any).biases;
    return biases.map(bias => this.calculateBiasGradient(bias));
}

private calculateActivationGradients(layer: Layer): number[] {
    const activations = (layer as any).getActivations();
    return activations.map(activation => {
        const value = (layer as any).activate(activation);
        return this.calculateActivationGradient(value);
    });
}

private calculateActivationGradient(value: number): number {
    return value * (1 - value); // Derivative of sigmoid
}
private optimizeGradients(): void {
    const learningRate = this.config.learningRate;
    const momentum = this.config.momentum || 0.9;
    
    for (const layer of this.layers) {
        if (layer instanceof HiddenLayer || layer instanceof OutputLayer) {
            this.optimizeLayerGradients(layer, learningRate, momentum);
        }
    }
}

private optimizeLayerGradients(layer: Layer, learningRate: number, momentum: number): void {
    const weightGradients = this.calculateWeightGradients(layer);
    const biasGradients = this.calculateBiasGradients(layer);
    
    this.updateWeights(layer, weightGradients, learningRate, momentum);
    this.updateBiases(layer, biasGradients, learningRate, momentum);
}
private updateWeights(layer: Layer, gradients: number[][], learningRate: number, momentum: number): void {
    const weights = (layer as any).weights;
    for (let i = 0; i < weights.length; i++) {
        for (let j = 0; j < weights[i].length; j++) {
            const update = gradients[i][j] * learningRate + 
                          this.previousWeightUpdates[i][j] * momentum;
            weights[i][j] += update;
            this.previousWeightUpdates[i][j] = update;
        }
    }
}

private updateBiases(layer: Layer, gradients: number[], learningRate: number, momentum: number): void {
    const biases = (layer as any).biases;
    for (let i = 0; i < biases.length; i++) {
        const update = gradients[i] * learningRate + 
                      this.previousBiasUpdates[i] * momentum;
        biases[i] += update;
        this.previousBiasUpdates[i] = update;
    }
}
private initializeGradientHistory(): void {
    this.gradientHistory = {
        weights: this.layers.map(layer => 
            (layer as any).weights?.map(row => 
                row.map(() => ({ sum: 0, squared: 0 }))
            )
        ),
        biases: this.layers.map(layer =>
            (layer as any).biases?.map(() => ({ sum: 0, squared: 0 }))
        )
    };
}

private updateGradientHistory(gradients: LayerGradients[]): void {
    gradients.forEach((layerGradients, layerIndex) => {
        this.updateLayerGradientHistory(layerGradients, layerIndex);
    });
}
private updateLayerGradientHistory(layerGradients: LayerGradients, layerIndex: number): void {
    const beta1 = 0.9;  // Exponential decay rate for first moment
    const beta2 = 0.999;  // Exponential decay rate for second moment
    
    this.updateWeightGradientHistory(layerGradients.weightGradients, layerIndex, beta1, beta2);
    this.updateBiasGradientHistory(layerGradients.biasGradients, layerIndex, beta1, beta2);
}

private updateWeightGradientHistory(weightGradients: number[][], layerIndex: number, beta1: number, beta2: number): void {
    weightGradients.forEach((row, i) => {
        row.forEach((gradient, j) => {
            const history = this.gradientHistory.weights[layerIndex][i][j];
            history.sum = beta1 * history.sum + (1 - beta1) * gradient;
            history.squared = beta2 * history.squared + (1 - beta2) * gradient * gradient;
        });
    });
}
private updateBiasGradientHistory(biasGradients: number[], layerIndex: number, beta1: number, beta2: number): void {
    biasGradients.forEach((gradient, i) => {
        const history = this.gradientHistory.biases[layerIndex][i];
        history.sum = beta1 * history.sum + (1 - beta1) * gradient;
        history.squared = beta2 * history.squared + (1 - beta2) * gradient * gradient;
    });
}

private calculateAdaptiveLearningRate(history: GradientHistory): number {
    const epsilon = 1e-8;
    const correctedSum = history.sum / (1 - Math.pow(0.9, this.currentEpoch));
    const correctedSquared = history.squared / (1 - Math.pow(0.999, this.currentEpoch));
    
    return correctedSum / (Math.sqrt(correctedSquared) + epsilon);
}
private applyAdvancedOptimization(): void {
    const optimizers = {
        adam: this.adamOptimizer.bind(this),
        rmsprop: this.rmsPropOptimizer.bind(this),
        adadelta: this.adadeltaOptimizer.bind(this)
    };

    const selectedOptimizer = optimizers[this.config.optimizer || 'adam'];
    selectedOptimizer();
}

private adamOptimizer(): void {
    const beta1 = 0.9;
    const beta2 = 0.999;
    const epsilon = 1e-8;

    this.layers.forEach((layer, layerIndex) => {
        if (layer instanceof HiddenLayer || layer instanceof OutputLayer) {
            this.applyAdamUpdate(layer, layerIndex, beta1, beta2, epsilon);
        }
    });
}
private updateLearningRate(): void {
    const schedulers = {
        step: this.stepDecay.bind(this),
        exponential: this.exponentialDecay.bind(this),
        cosine: this.cosineAnnealing.bind(this)
    };

    const scheduler = schedulers[this.config.scheduler || 'step'];
    this.currentLearningRate = scheduler();
}

private stepDecay(): number {
    const dropRate = 0.5;
    const stepsPerDrop = 10;
    return this.config.learningRate * 
           Math.pow(dropRate, Math.floor(this.currentEpoch / stepsPerDrop));
}
private initializeEarlyStopping(): void {
    this.earlyStoppingConfig = {
        patience: this.config.patience || 10,
        minDelta: this.config.minDelta || 1e-4,
        bestLoss: Infinity,
        waitCount: 0
    };
}

private checkEarlyStopping(currentLoss: number): boolean {
    if (currentLoss < this.earlyStoppingConfig.bestLoss - 
        this.earlyStoppingConfig.minDelta) {
        this.earlyStoppingConfig.bestLoss = currentLoss;
        this.earlyStoppingConfig.waitCount = 0;
        return false;
    }
    
    this.earlyStoppingConfig.waitCount++;
    return this.earlyStoppingConfig.waitCount >= this.earlyStoppingConfig.patience;
}
private calculateModelMetrics(): ModelMetrics {
    return {
        accuracy: this.calculateAccuracyMetric(),
        precision: this.calculatePrecisionMetric(),
        recall: this.calculateRecallMetric(),
        f1Score: this.calculateF1ScoreMetric(),
        auc: this.calculateAUCMetric(),
        confusionMatrix: this.generateConfusionMatrix()
    };
}

private calculateAccuracyMetric(): number {
    const predictions = this.predict(this.validationData);
    return predictions.filter((pred, i) => 
        pred === this.validationLabels[i]
    ).length / predictions.length;
}

